## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## Global Axios Configuration

| Test Name | Purpose |
|---|---|
| sets global axios defaults | Verifies global axios defaults are configured correctly for base URL, content type, and credentials. |

## axiosRequest Instance

| Test Name | Purpose |
|---|---|
| creates axiosRequest with correct config | Verifies the axiosRequest instance is created with the correct default configuration. |

## axiosResponse Instance

| Test Name | Purpose |
|---|---|
| creates axiosResponse with correct config | Verifies the axiosResponse instance is created with the correct default configuration. |

## Response Interceptor — Success Handling

| Test Name | Purpose |
|---|---|
| returns response unchanged on success | Verifies successful responses pass through the interceptor unchanged. |

## Response Interceptor — 401 Retry Logic

| Test Name | Purpose |
|---|---|
| retries request on 401 and refresh succeeds | Verifies failed requests retry successfully after token refresh. |
| does not retry if request already retried | Verifies retry loops are prevented using the `_retry` flag. |
| does not retry login endpoint | Verifies login requests are excluded from refresh retry logic. |
| does not retry refresh endpoint | Verifies refresh token requests are excluded from retry logic. |
| rejects if refresh request fails | Verifies interceptor rejects the request if token refresh fails. |
