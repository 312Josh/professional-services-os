const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.activity.deleteMany();
  await prisma.invoiceLineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.job.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.session.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.create({
    data: {
      email: "partner@mitchelllaw.com",
      name: "Sarah Mitchell",
      passwordHash,
    },
  });

  // Inquiries (leads)
  const now = new Date();
  const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000);
  const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const leads = await Promise.all([
    prisma.lead.create({ data: { name: "Maria Santos", email: "maria@example.com", phone: "(312) 555-0201", serviceRequested: "Divorce consultation", source: "website", status: "new", createdAt: hoursAgo(1) } }),
    prisma.lead.create({ data: { name: "James Wilson", email: "james@example.com", phone: "(312) 555-0202", serviceRequested: "Estate planning", source: "referral", status: "contacted", createdAt: daysAgo(2) } }),
    prisma.lead.create({ data: { name: "Linda Chen", email: "linda@example.com", phone: "(312) 555-0203", serviceRequested: "Business incorporation", source: "website", status: "new", createdAt: hoursAgo(3) } }),
    prisma.lead.create({ data: { name: "Robert Kim", email: "robert@example.com", phone: "(312) 555-0204", serviceRequested: "Personal injury consultation", source: "phone", status: "new", createdAt: hoursAgo(5) } }),
    prisma.lead.create({ data: { name: "Angela Torres", email: "angela@example.com", phone: "(312) 555-0205", serviceRequested: "Real estate closing", source: "website", status: "contacted", createdAt: daysAgo(3) } }),
  ]);

  // Clients (customers)
  const client1 = await prisma.customer.create({
    data: { name: "David Park", email: "david@example.com", phone: "(312) 555-0210", address: "456 Oak Ave, Naperville, IL 60540" },
  });

  const client2 = await prisma.customer.create({
    data: { name: "Jennifer Ross", email: "jennifer@example.com", phone: "(312) 555-0211", address: "789 Elm St, Schaumburg, IL 60173" },
  });

  // Convert one lead
  await prisma.lead.update({ where: { id: leads[1].id }, data: { status: "converted", convertedCustomerId: client1.id } });

  // Engagements (jobs)
  const engagement1 = await prisma.job.create({
    data: {
      title: "Estate Planning — Park Family Trust",
      description: "Revocable living trust, pour-over will, power of attorney, healthcare directive",
      serviceDate: daysAgo(-2),
      status: "in_progress",
      customerId: client1.id,
      leadId: leads[1].id,
    },
  });

  const engagement2 = await prisma.job.create({
    data: {
      title: "Residential Real Estate Closing",
      description: "Buyer representation, title review, closing documentation",
      serviceDate: daysAgo(-14),
      status: "scheduled",
      customerId: client2.id,
    },
  });

  // Invoice
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-001",
      issueDate: daysAgo(5),
      dueDate: daysAgo(-25),
      totalCents: 350000,
      status: "sent",
      customerId: client1.id,
      jobId: engagement1.id,
    },
  });

  await prisma.invoiceLineItem.create({
    data: {
      description: "Estate Planning — Trust Document Preparation",
      quantity: 1,
      unitPriceCents: 250000,
      lineTotalCents: 250000,
      invoiceId: invoice.id,
    },
  });

  await prisma.invoiceLineItem.create({
    data: {
      description: "Power of Attorney & Healthcare Directive",
      quantity: 1,
      unitPriceCents: 100000,
      lineTotalCents: 100000,
      invoiceId: invoice.id,
    },
  });

  // Activities
  await prisma.activity.create({ data: { type: "lead_created", message: "New inquiry: Maria Santos — Divorce consultation", adminId: admin.id, leadId: leads[0].id } });
  await prisma.activity.create({ data: { type: "lead_contacted", message: "Responded to James Wilson — Estate planning inquiry", adminId: admin.id, leadId: leads[1].id } });
  await prisma.activity.create({ data: { type: "note", message: "Initial consultation completed. Client retained for estate planning.", adminId: admin.id, customerId: client1.id } });
  await prisma.activity.create({ data: { type: "invoice_sent", message: "Invoice INV-2026-001 sent to David Park — $3,500.00", adminId: admin.id, invoiceId: invoice.id } });

  console.log("Seed complete. Login: partner@mitchelllaw.com / admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
