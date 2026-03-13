const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const businessName = (process.env.BUSINESS_NAME || "Apex Field Services").trim() || "Apex Field Services";
const demoAdminEmail = (process.env.DEMO_ADMIN_EMAIL || "owner@fieldops.local").trim() || "owner@fieldops.local";
const demoAdminPassword = (process.env.DEMO_ADMIN_PASSWORD || "admin123").trim() || "admin123";

function toCents(value) {
  return Math.round(value * 100);
}

async function main() {
  const now = new Date();
  const staleLeadCreatedAt = new Date(now.getTime() - 30 * 60 * 60 * 1000);
  const responseLateLeadCreatedAt = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const freshLeadCreatedAt = new Date(now.getTime() - 8 * 60 * 1000);
  const followUpLeadCreatedAt = new Date(now.getTime() - 72 * 60 * 60 * 1000);
  const followUpLeadTouchedAt = new Date(now.getTime() - 54 * 60 * 60 * 1000);

  const passwordHash = await bcrypt.hash(demoAdminPassword, 10);

  await prisma.activity.deleteMany();
  await prisma.invoiceLineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.job.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.session.deleteMany();

  const admin = await prisma.admin.upsert({
    where: { email: demoAdminEmail },
    create: {
      email: demoAdminEmail,
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
      createdAt: staleLeadCreatedAt,
      updatedAt: staleLeadCreatedAt,
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
      createdAt: followUpLeadCreatedAt,
      updatedAt: followUpLeadTouchedAt,
    },
  });

  await prisma.lead.create({
    data: {
      name: "Derek Fields",
      phone: "(555) 200-1104",
      email: "derek@example.com",
      address: "88 Cedar Way",
      source: "Website",
      serviceRequested: "Panel upgrade estimate",
      status: "new",
      createdAt: responseLateLeadCreatedAt,
      updatedAt: responseLateLeadCreatedAt,
    },
  });

  await prisma.lead.create({
    data: {
      name: "Evelyn Carter",
      phone: "(555) 200-1105",
      email: "evelyn@example.com",
      address: "17 Willow Ct",
      source: "LSA",
      serviceRequested: "No-heat emergency",
      status: "new",
      createdAt: freshLeadCreatedAt,
      updatedAt: freshLeadCreatedAt,
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
      notes: `Thank you for choosing ${businessName}.`,
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

  console.log(`Seed complete. Login: ${demoAdminEmail} / ${demoAdminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
