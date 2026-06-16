export async function generateOrderNumber(prisma: {
  order: { count: () => Promise<number> };
}): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.order.count();
  const padded = String(count + 1).padStart(5, "0");
  return `TT-${year}-${padded}`;
}
