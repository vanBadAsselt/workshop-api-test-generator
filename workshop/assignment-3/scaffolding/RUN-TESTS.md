# Running K6 Tests

## Prerequisites

Make sure you have k6 installed:

```bash
# macOS (Homebrew)
brew install k6

# Linux (Debian/Ubuntu)
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows (Chocolatey)
choco install k6

# Or download from https://k6.io/docs/get-started/installation/
```

## Running Tests

### Prerequisites for TypeScript Tests

K6 doesn't natively support TypeScript, so we need to compile to JavaScript first:

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build
```

### Run with k6

After building, run the compiled JavaScript:

```bash
# Basic run (using smoke test config)
k6 run dist/main.js

# With specific test type
TEST_TYPE=smoke k6 run dist/main.js

# With specific environment
ENV=dev TEST_TYPE=smoke k6 run dist/main.js

# Run against production
ENV=prd TEST_TYPE=load k6 run dist/main.js
```

### Environment Variables

- `TEST_TYPE`: Test configuration to use (smoke, load, stress, etc.)
  - Default: `smoke`
  - Loads config from `config/options.<test_type>.json`

- `ENV`: Environment to test against (dev, prd)
  - Default: `prd`
  - Loads test data from `testdata/testdata.<env>.ts`

- `GRAPHQL_URL`: GraphQL endpoint URL
  - Should be set in your environment or CI/CD
  - Example: `http://localhost:4000/graphql`

### Example Workflows

#### Development Testing
```bash
# 1. Build TypeScript
npm run build

# 2. Run smoke tests against dev
GRAPHQL_URL=http://localhost:4000 ENV=dev TEST_TYPE=smoke k6 run dist/main.js
```

#### CI/CD Pipeline
```bash
# Run smoke tests as part of deployment
npm run build
GRAPHQL_URL=$PROD_GRAPHQL_URL ENV=prd TEST_TYPE=smoke k6 run dist/main.js
```

#### Load Testing
```bash
# Run load tests against staging
npm run build
GRAPHQL_URL=$STAGING_GRAPHQL_URL ENV=prd TEST_TYPE=load k6 run dist/main.js
```

## Test Configuration

Each test type has its own configuration in `config/options.*.json`:

### Smoke Test (options.smoke.json)
Quick validation with minimal load:
- 1 VU (Virtual User)
- 1 iteration per scenario
- Fast execution

### Load Test (options.load.json)
Sustained load testing:
- Multiple VUs
- Multiple iterations or duration-based
- Validates system under normal load

### Stress Test (options.stress.json)
Push system to limits:
- Increasing VUs over time
- Identifies breaking points
- Validates system recovery

## Scenarios

Each test scenario is configured in the options file:

```json
{
  "scenarios": {
    "getCharacterTestScenario": {
      "executor": "per-vu-iterations",
      "tags": {
        "run_type": "Smoke",
        "scenario": "getCharacterTestScenario"
      },
      "exec": "getCharacterTestScenario",
      "vus": 1,
      "iterations": 1,
      "maxDuration": "5m"
    }
  }
}
```

- `exec`: Function name in main.ts to execute
- `executor`: K6 executor type (per-vu-iterations, constant-vus, ramping-vus, etc.)
- `vus`: Number of virtual users
- `iterations`: Number of times to run the test
- `maxDuration`: Maximum time before timeout

## Viewing Results

K6 outputs results to the console by default:

```
     ✓ Should retrieve the correct character information
     ✓ Typename
     ✓ Character ID
     ✓ Character Name
     ...

     checks.........................: 100.00% ✓ 45       ✗ 0
     data_received..................: 3.2 kB  320 B/s
     data_sent......................: 1.1 kB  110 B/s
     http_req_duration..............: avg=234.56ms min=234.56ms med=234.56ms max=234.56ms p(90)=234.56ms p(95)=234.56ms
     http_reqs......................: 1       0.1/s
     iteration_duration.............: avg=1.23s    min=1.23s    med=1.23s    max=1.23s    p(90)=1.23s    p(95)=1.23s
     iterations.....................: 1       0.1/s
```

### Export Results

```bash
# Export to JSON
k6 run --out json=results.json dist/main.js

# Export to InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 dist/main.js

# Export to Grafana Cloud
k6 run --out cloud dist/main.js
```

## Troubleshooting

### "Cannot find module" errors
Make sure you've built the TypeScript files:
```bash
npm run build
```

### "GRAPHQL_URL is not defined"
Set the GRAPHQL_URL environment variable:
```bash
export GRAPHQL_URL=http://localhost:4000
```

### Tests are failing
1. Check that your API is running
2. Verify test data in `testdata/testdata.dev.ts` is correct
3. Check the GraphQL endpoint URL
4. Review the console output for specific errors

### TypeScript compilation errors
Make sure you have the correct dependencies:
```bash
npm install
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: K6 Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build tests
        run: npm run build

      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run smoke tests
        run: GRAPHQL_URL=${{ secrets.API_URL }} ENV=prd k6 run dist/main.js
```

## Next Steps

- Add more test scenarios using `add-test-from-har.ts`
- Configure different test types (load, stress, spike)
- Set up monitoring and alerting
- Integrate with CI/CD pipeline
