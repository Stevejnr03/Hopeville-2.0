const mockUser = {
  id: 1,
  firstName: "Adaeze",
  lastName: "Okonkwo",
  email: "adaeze@email.com",
  phone: "+234 800 000 0000",
  avatar: null,
  joinedDate: "January 2026",
};

const mockOrders = [
  {
    id: "HEC-001",
    date: "June 15, 2026",
    status: "Delivered",
    total: 95000,
    items: [
      { name: "Sofia Cat Eye", variant: "Tortoise Shell", quantity: 1, price: 95000, image: null },
    ],
    fulfillment: "delivery",
    address: "12 Example Street, Port Harcourt",
  },
  {
    id: "HEC-002",
    date: "June 10, 2026",
    status: "Pending",
    total: 157000,
    items: [
      { name: "Slim Titanium", variant: "Gunmetal", quantity: 1, price: 145000, image: null },
      { name: "Classic Aviator", variant: "Gold Frame", quantity: 1, price: 85000, image: null },
    ],
    fulfillment: "pickup",
    address: "#64 Alcon Road, Woji, Port Harcourt",
  },
  {
    id: "HEC-003",
    date: "May 28, 2026",
    status: "Cancelled",
    total: 72000,
    items: [
      { name: "Urban Square", variant: "Matte Black", quantity: 1, price: 72000, image: null },
    ],
    fulfillment: "delivery",
    address: "12 Example Street, Port Harcourt",
  },
];

const mockAppointments = [
  {
    id: "APT-001",
    service: "Complete Eye Health Diagnostics",
    date: "June 25, 2026",
    time: "10:00 AM",
    doctor: "Dr. Ezinne Ihekweaba",
    status: "Upcoming",
    notes: "Please bring your previous prescription if you have one.",
  },
  {
    id: "APT-002",
    service: "Dry Eye Clinic",
    date: "June 5, 2026",
    time: "2:00 PM",
    doctor: "Dr. Ezinne Ihekweaba",
    status: "Completed",
    notes: "",
  },
  {
    id: "APT-003",
    service: "Retinal Evaluation",
    date: "May 20, 2026",
    time: "11:30 AM",
    doctor: "Dr. Ezinne Ihekweaba",
    status: "Cancelled",
    notes: "",
  },
];

export { mockUser, mockOrders, mockAppointments };