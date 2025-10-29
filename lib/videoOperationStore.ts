/**
 * 简单的内存存储，用于保存 Google GenAI 视频生成的 operation 对象。
 * 注意：此存储仅在单个 Node 进程的生命周期内有效，不适合分布式或无服务器环境。
 */

type AnyOperation = { name?: string } & Record<string, any>;

const operations = new Map<string, AnyOperation>();

export function saveVideoOperation(operation: AnyOperation) {
  if (operation && typeof operation.name === 'string' && operation.name.length > 0) {
    operations.set(operation.name, operation);
  }
}

export function getVideoOperation(name: string): AnyOperation | undefined {
  return operations.get(name);
}

export function updateVideoOperation(operation: AnyOperation) {
  saveVideoOperation(operation);
}