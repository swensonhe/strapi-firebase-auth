// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function promiseHandler(promise: Promise<any>) {
  return Promise.allSettled([promise]).then(([result]) => {
    if (result.status === "rejected") return { error: result.reason };
    return { data: result.value };
  });
}
