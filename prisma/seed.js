const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function toCents(value) {
  return Math.round(value * 100);
}

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.activity.deleteMany();
  await prisma.invoiceLineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.job.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.session.deleteMany();

  const admin = await prisma.admin.upsert({
    where: { email: "admin@plumbing.local" },
    create: {
      email: "admin@plumbing.local",
      name: "Shop Admin",
      passwordHash,
    },
    update: {
      name: "Shop Admin",
      passwordHash,
    },
  });

  const leadA = await prisma.lead.create({
    data: {
      name: "Alice Johnson",
      phone: "(555) 200-1001",
      email: "alice@example.com",
      address: "101 Main St",
      source: "Google",
      serviceRequested: "Water heater replacement",
      status: "new",
    },
  });

  const leadB = await prisma.lead.create({
    data: {
      name: "Bob Martinez",
      phone: "(555) 200-1002",
      email: "bob@example.com",
      address: "22 Oak Ave",
      source: "Referral",
      serviceRequested: "Drain cleaning",
      status: "contacted",
    },
  });

  const customer = await prisma.customer.create({
    data: {
      name: "Carla Nguyen",
      phone: "(555) 200-1003",
      email: "carla@example.com",
      address: "304 Pine Rd",
    },
  });

  await prisma.lead.create({
    data: {
      name: "Carla Nguyen",
      phone: "(555) 200-1003",
      email: "carla@example.com",
      address: "304 Pine Rd",
      source: "Website",
      serviceRequested: "Leak under kitchen sink",
      status: "converted",
      convertedCustomerId: customer.id,
    },
  });

  const job = await prisma.job.create({
    data: {
      title: "Kitchen sink leak repair",
      description: "Replace worn P-trap and test all joints.",
      serviceDate: new Date(),
      status: "in_progress",
      customerId: customer.id,
      leadId: leadB.id,
    },
  });

  const subtotalCents = toCents(220);
  const taxCents = toCents(17.6);
  const totalCents = subtotalCents + taxCents;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-DEMO-1001",
      customerId: customer.id,
      jobId: job.id,
      status: "sent",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      subtotalCents,
      taxCents,
      totalCents,
      paymentMethod: "stripe",
      paymentLink: "https://payments.example.com/pay/inv-demo-1001",
      notes: "Thank you for choosing BluePipe Plumbing.",
      lineItems: {
        create: [
          {
            description: "Service call",
            quantity: 1,
            unitPriceCents: toCents(95),
            lineTotalCents: toCents(95),
          },
          {
            description: "Pipe parts and fittings",
            quantity: 1,
            unitPriceCents: toCents(65),
            lineTotalCents: toCents(65),
          },
          {
            description: "Labor (1 hour)",
            quantity: 1,
            unitPriceCents: toCents(60),
            lineTotalCents: toCents(60),
          },
        ],
      },
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        type: "created",
        message: "Seeded lead Alice Johnson",
        adminId: admin.id,
        leadId: leadA.id,
      },
      {
        type: "created",
        message: "Seeded lead Bob Martinez",
        adminId: admin.id,
        leadId: leadB.id,
      },
      {
        type: "conversion",
        message: "Lead converted to customer Carla Nguyen",
        adminId: admin.id,
        customerId: customer.id,
      },
      {
        type: "created",
        message: "Seeded job Kitchen sink leak repair",
        adminId: admin.id,
        customerId: customer.id,
        jobId: job.id,
      },
      {
        type: "email_sent",
        message: "Seeded invoice email marked as sent",
        adminId: admin.id,
        customerId: customer.id,
        invoiceId: invoice.id,
      },
    ],
  });

  console.log("Seed complete. Login: admin@plumbing.local / admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
