import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { invoice } = await readBody(event);

  assertMethod(event, ["PUT"]);

  const invoiceToUpdate = await prisma.invoice.update({
    where: {
      id: invoice.id,
    },
    data: {
      status: invoice.status,
    },
  });

  if (!invoiceToUpdate) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invoice not found",
    });
  }

  return {
    invoiceToUpdate,
  };
});
