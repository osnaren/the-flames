import { calculateFlames, flamesApi, FlamesApiRequest } from '../api/flames';
import { validateFlamesInput } from './validation';

// Test data sets
export const TEST_CASES = {
  valid: [
    { name1: 'John', name2: 'Jane', expected: 'valid' },
    { name1: 'Alice', name2: 'Bob', expected: 'valid' },
    { name1: 'Emma', name2: 'William', expected: 'valid' },
    { name1: 'Olivia', name2: 'James', expected: 'valid' },
    { name1: 'Sophia', name2: 'Benjamin', expected: 'valid' },
  ],
  invalid: [
    { name1: '', name2: 'Jane', expected: 'empty_name1' },
    { name1: 'John', name2: '', expected: 'empty_name2' },
    { name1: 'J@hn', name2: 'Jane', expected: 'invalid_chars' },
    { name1: 'John', name2: 'J@ne', expected: 'invalid_chars' },
    { name1: 'A'.repeat(51), name2: 'Jane', expected: 'too_long' },
  ],
  edge: [
    { name1: 'A', name2: 'B', expected: 'single_char' },
    { name1: 'John', name2: 'john', expected: 'case_insensitive' },
    { name1: 'John', name2: 'John', expected: 'identical' },
    { name1: 'José', name2: 'María', expected: 'unicode' },
    { name1: "O'Connor", name2: 'Mary-Jane', expected: 'special_chars' },
  ],
};

// Performance test cases
export const PERFORMANCE_TESTS = {
  light: { iterations: 100, maxTime: 100 }, // 100ms
  medium: { iterations: 1000, maxTime: 500 }, // 500ms
  heavy: { iterations: 10000, maxTime: 2000 }, // 2s
};

export interface TestResult {
  passed: boolean;
  error?: string;
  duration?: number;
  result?: any;
}

export interface BenchmarkResult {
  testName: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  passed: boolean;
  error?: string;
}

/**
 * Test the validation function
 */
export function testValidation(): TestResult[] {
  const results: TestResult[] = [];

  // Test valid names
  TEST_CASES.valid.forEach(({ name1, name2 }, index) => {
    const start = performance.now();
    try {
      const result = validateFlamesInput(name1, name2);
      const duration = performance.now() - start;

      results.push({
        passed: result.isValid,
        duration,
        result: result.isValid ? 'valid' : result.errors,
      });
    } catch (error) {
      results.push({
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - start,
      });
    }
  });

  // Test invalid names
  TEST_CASES.invalid.forEach(({ name1, name2 }, index) => {
    const start = performance.now();
    try {
      const result = validateFlamesInput(name1, name2);
      const duration = performance.now() - start;

      results.push({
        passed: !result.isValid, // Should be invalid
        duration,
        result: result.isValid ? 'unexpected_valid' : 'correctly_invalid',
      });
    } catch (error) {
      results.push({
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - start,
      });
    }
  });

  return results;
}

/**
 * Test the FLAMES calculation
 */
export function testFlamesCalculation(): TestResult[] {
  const results: TestResult[] = [];

  TEST_CASES.valid.forEach(({ name1, name2 }) => {
    const start = performance.now();
    try {
      const result = calculateFlames(name1, name2);
      const duration = performance.now() - start;

      // Validate result structure
      const isValid =
        result.result &&
        ['F', 'L', 'A', 'M', 'E', 'S'].includes(result.result) &&
        Array.isArray(result.commonLetters) &&
        Array.isArray(result.flamesLetters) &&
        typeof result.finalCount === 'number';

      results.push({
        passed: isValid,
        duration,
        result: {
          result: result.result,
          commonLetters: result.commonLetters.length,
          finalCount: result.finalCount,
        },
      });
    } catch (error) {
      results.push({
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - start,
      });
    }
  });

  return results;
}

/**
 * Test the API endpoint
 */
export async function testFlamesApi(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // Test valid requests
  for (const { name1, name2 } of TEST_CASES.valid) {
    const start = performance.now();
    try {
      const request: FlamesApiRequest = { name1, name2 };
      const result = await flamesApi(request);
      const duration = performance.now() - start;

      results.push({
        passed: result.success && !!result.data,
        duration,
        result: result.success ? result.data?.result : result.error,
      });
    } catch (error) {
      results.push({
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - start,
      });
    }
  }

  // Test invalid requests
  for (const { name1, name2 } of TEST_CASES.invalid) {
    const start = performance.now();
    try {
      const request: FlamesApiRequest = { name1, name2 };
      const result = await flamesApi(request);
      const duration = performance.now() - start;

      results.push({
        passed: !result.success, // Should fail
        duration,
        result: result.success ? 'unexpected_success' : result.error?.code,
      });
    } catch (error) {
      results.push({
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - start,
      });
    }
  }

  return results;
}

/**
 * Performance benchmark for validation
 */
export function benchmarkValidation(testLevel: keyof typeof PERFORMANCE_TESTS = 'medium'): BenchmarkResult {
  const { iterations, maxTime } = PERFORMANCE_TESTS[testLevel];
  const testCase = TEST_CASES.valid[0];
  const times: number[] = [];

  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      validateFlamesInput(testCase.name1, testCase.name2);
      times.push(performance.now() - start);
    } catch (error) {
      return {
        testName: `Validation Benchmark (${testLevel})`,
        iterations: i,
        totalTime: performance.now() - startTime,
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  const totalTime = performance.now() - startTime;
  const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  return {
    testName: `Validation Benchmark (${testLevel})`,
    iterations,
    totalTime,
    averageTime,
    minTime,
    maxTime,
    passed: totalTime <= maxTime,
  };
}

/**
 * Performance benchmark for FLAMES calculation
 */
export function benchmarkFlamesCalculation(testLevel: keyof typeof PERFORMANCE_TESTS = 'medium'): BenchmarkResult {
  const { iterations, maxTime } = PERFORMANCE_TESTS[testLevel];
  const testCase = TEST_CASES.valid[0];
  const times: number[] = [];

  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      calculateFlames(testCase.name1, testCase.name2);
      times.push(performance.now() - start);
    } catch (error) {
      return {
        testName: `FLAMES Calculation Benchmark (${testLevel})`,
        iterations: i,
        totalTime: performance.now() - startTime,
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  const totalTime = performance.now() - startTime;
  const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  return {
    testName: `FLAMES Calculation Benchmark (${testLevel})`,
    iterations,
    totalTime,
    averageTime,
    minTime,
    maxTime,
    passed: totalTime <= maxTime,
  };
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<{
  validation: TestResult[];
  flamesCalculation: TestResult[];
  flamesApi: TestResult[];
  benchmarks: BenchmarkResult[];
}> {
  console.log('🧪 Running comprehensive test suite...');

  const start = performance.now();

  // Unit tests
  console.log('📋 Running validation tests...');
  const validation = testValidation();

  console.log('🔥 Running FLAMES calculation tests...');
  const flamesCalculation = testFlamesCalculation();

  console.log('🌐 Running API tests...');
  const flamesApi = await testFlamesApi();

  // Performance benchmarks
  console.log('⚡ Running performance benchmarks...');
  const benchmarks = [
    benchmarkValidation('light'),
    benchmarkValidation('medium'),
    benchmarkFlamesCalculation('light'),
    benchmarkFlamesCalculation('medium'),
  ];

  const totalTime = performance.now() - start;
  console.log(`✅ Test suite completed in ${totalTime.toFixed(2)}ms`);

  return {
    validation,
    flamesCalculation,
    flamesApi,
    benchmarks,
  };
}

/**
 * Generate test report
 */
export function generateTestReport(results: Awaited<ReturnType<typeof runAllTests>>): string {
  const { validation, flamesCalculation, flamesApi, benchmarks } = results;

  const report = [];
  report.push('# FLAMES Game Test Report');
  report.push('');

  // Summary
  const totalTests = validation.length + flamesCalculation.length + flamesApi.length;
  const passedTests = [...validation, ...flamesCalculation, ...flamesApi].filter((test) => test.passed).length;

  report.push(`## Summary`);
  report.push(`- Total Tests: ${totalTests}`);
  report.push(`- Passed: ${passedTests}`);
  report.push(`- Failed: ${totalTests - passedTests}`);
  report.push(`- Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  report.push('');

  // Validation tests
  report.push(`## Validation Tests (${validation.length})`);
  const validationPassed = validation.filter((test) => test.passed).length;
  report.push(`Passed: ${validationPassed}/${validation.length}`);
  if (validation.some((test) => !test.passed)) {
    report.push('Failed tests:');
    validation.forEach((test, index) => {
      if (!test.passed) {
        report.push(`- Test ${index + 1}: ${test.error || 'Failed'}`);
      }
    });
  }
  report.push('');

  // FLAMES calculation tests
  report.push(`## FLAMES Calculation Tests (${flamesCalculation.length})`);
  const flamesPassed = flamesCalculation.filter((test) => test.passed).length;
  report.push(`Passed: ${flamesPassed}/${flamesCalculation.length}`);
  if (flamesCalculation.some((test) => !test.passed)) {
    report.push('Failed tests:');
    flamesCalculation.forEach((test, index) => {
      if (!test.passed) {
        report.push(`- Test ${index + 1}: ${test.error || 'Failed'}`);
      }
    });
  }
  report.push('');

  // API tests
  report.push(`## API Tests (${flamesApi.length})`);
  const apiPassed = flamesApi.filter((test) => test.passed).length;
  report.push(`Passed: ${apiPassed}/${flamesApi.length}`);
  if (flamesApi.some((test) => !test.passed)) {
    report.push('Failed tests:');
    flamesApi.forEach((test, index) => {
      if (!test.passed) {
        report.push(`- Test ${index + 1}: ${test.error || 'Failed'}`);
      }
    });
  }
  report.push('');

  // Benchmarks
  report.push(`## Performance Benchmarks`);
  benchmarks.forEach((benchmark) => {
    report.push(`### ${benchmark.testName}`);
    report.push(`- Status: ${benchmark.passed ? '✅ PASS' : '❌ FAIL'}`);
    report.push(`- Iterations: ${benchmark.iterations}`);
    report.push(`- Total Time: ${benchmark.totalTime.toFixed(2)}ms`);
    report.push(`- Average Time: ${benchmark.averageTime.toFixed(4)}ms`);
    report.push(`- Min Time: ${benchmark.minTime.toFixed(4)}ms`);
    report.push(`- Max Time: ${benchmark.maxTime.toFixed(4)}ms`);
    if (benchmark.error) {
      report.push(`- Error: ${benchmark.error}`);
    }
    report.push('');
  });

  return report.join('\n');
}
