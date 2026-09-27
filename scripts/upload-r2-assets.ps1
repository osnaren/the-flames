param(
  [string]$AccountId = '3a55b5eea3419949ffb67ad9755cee64',
  [string]$Bucket = 'osnaren',
  [string]$Prefix = 'the-flames/v1',
  [int]$ThrottleLimit = 4,
  [string]$OnlyKey = '*',
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$public = (Resolve-Path (Join-Path $PSScriptRoot '..\public')).Path
$wrangler = (Get-Command wrangler -ErrorAction Stop).Source
$types = @{
  '.gif' = 'image/gif'
  '.ico' = 'image/x-icon'
  '.jpg' = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.json' = 'application/json'
  '.lottie' = 'application/zip'
  '.mp3' = 'audio/mpeg'
  '.png' = 'image/png'
  '.svg' = 'image/svg+xml'
  '.wav' = 'audio/wav'
  '.webp' = 'image/webp'
}

$assets = @(Get-ChildItem -LiteralPath $public -Recurse -File | Where-Object {
  $types.ContainsKey($_.Extension.ToLowerInvariant()) -and
  -not $_.FullName.StartsWith((Join-Path $public 'generated') + [IO.Path]::DirectorySeparatorChar)
} | ForEach-Object {
  $relative = $_.FullName.Substring($public.Length + 1).Replace('\', '/')
  [pscustomobject]@{
    Path = $_.FullName
    Key = "$Prefix/$relative"
    ContentType = $types[$_.Extension.ToLowerInvariant()]
    Bytes = $_.Length
  }
} | Where-Object { $_.Key -like $OnlyKey })

Write-Output "Uploading $($assets.Count) assets ($([math]::Round(($assets | Measure-Object Bytes -Sum).Sum / 1MB, 2)) MiB) to $Bucket/$Prefix"
if ($DryRun) {
  $assets | Select-Object Key, ContentType, Bytes
  return
}

$results = @($assets | ForEach-Object -Parallel {
  $asset = $_
  $env:CLOUDFLARE_ACCOUNT_ID = $using:AccountId
  $wranglerCommand = $using:wrangler
  $bucketName = $using:Bucket
  $output = & $wranglerCommand r2 object put "$bucketName/$($asset.Key)" "--file=$($asset.Path)" "--content-type=$($asset.ContentType)" --cache-control='public, max-age=31536000, immutable' --remote 2>&1
  [pscustomobject]@{
    Key = $asset.Key
    Bytes = $asset.Bytes
    Success = $LASTEXITCODE -eq 0
    Message = if ($LASTEXITCODE -eq 0) { 'uploaded' } else { ($output | Out-String).Trim() }
  }
} -ThrottleLimit $ThrottleLimit)

$failed = @($results | Where-Object { -not $_.Success })
Write-Output "Uploaded $($results.Count - $failed.Count)/$($assets.Count) assets."
if ($failed.Count) {
  $failed | Select-Object -First 5 Key, Message | Format-Table -Wrap
  throw "$($failed.Count) R2 uploads failed"
}
