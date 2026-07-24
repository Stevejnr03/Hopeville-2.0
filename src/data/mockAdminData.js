export const mockStats = {
  totalRevenue: 4875000,
  totalOrders: 47,
  totalAppointments: 83,
  totalProducts: 9,
  totalCustomers: 62,
  pendingOrders: 12,
  upcomingAppointments: 18,
  revenueChange: +12.5,
  ordersChange: +8.3,
  appointmentsChange: +15.2,
  customersChange: +6.7,
};

export const mockRevenueData = [
  { month: "Jan", revenue: 320000, orders: 6 },
  { month: "Feb", revenue: 450000, orders: 9 },
  { month: "Mar", revenue: 380000, orders: 7 },
  { month: "Apr", revenue: 520000, orders: 11 },
  { month: "May", revenue: 610000, orders: 13 },
  { month: "Jun", revenue: 875000, orders: 16 },
];

export const mockOrdersData = [
  { id: "HEC-047", customer: "Adaeze Okonkwo", email: "adaeze@email.com", date: "June 23, 2026", items: 2, total: 157000, status: "Pending", fulfillment: "delivery" },
  { id: "HEC-046", customer: "Emeka Tunde", email: "emeka@email.com", date: "June 22, 2026", items: 1, total: 95000, status: "Delivered", fulfillment: "pickup" },
  { id: "HEC-045", customer: "Fatima Abubakar", email: "fatima@email.com", date: "June 21, 2026", items: 3, total: 298000, status: "Pending", fulfillment: "delivery" },
  { id: "HEC-044", customer: "Chidi Okafor", email: "chidi@email.com", date: "June 20, 2026", items: 1, total: 72000, status: "Cancelled", fulfillment: "delivery" },
  { id: "HEC-043", customer: "Ngozi Eze", email: "ngozi@email.com", date: "June 19, 2026", items: 2, total: 220000, status: "Delivered", fulfillment: "pickup" },
  { id: "HEC-042", customer: "Ibrahim Musa", email: "ibrahim@email.com", date: "June 18, 2026", items: 1, total: 145000, status: "Delivered", fulfillment: "delivery" },
];

export const mockAppointmentsData = [
  { id: "APT-083", patient: "Adaeze Okonkwo", email: "adaeze@email.com", service: "Complete Eye Health Diagnostics", date: "June 25, 2026", time: "10:00 AM", status: "Upcoming" },
  { id: "APT-082", patient: "Emeka Tunde", email: "emeka@email.com", service: "Retinal Evaluation", date: "June 24, 2026", time: "2:30 PM", status: "Upcoming" },
  { id: "APT-081", patient: "Fatima Abubakar", email: "fatima@email.com", service: "Dry Eye Clinic", date: "June 23, 2026", time: "11:00 AM", status: "Completed" },
  { id: "APT-080", patient: "Chidi Okafor", email: "chidi@email.com", service: "Diabetic & Hypertensive Vision Care", date: "June 22, 2026", time: "9:00 AM", status: "Completed" },
  { id: "APT-079", patient: "Ngozi Eze", email: "ngozi@email.com", service: "Luxury Eyewear & Optical Services", date: "June 21, 2026", time: "3:00 PM", status: "Cancelled" },
];

export const mockCustomers = [
  { id: 1, name: "Adaeze Okonkwo", email: "adaeze@email.com", phone: "+234 800 000 0001", orders: 3, spent: 324000, joined: "Jan 2026", status: "Active" },
  { id: 2, name: "Emeka Tunde", email: "emeka@email.com", phone: "+234 800 000 0002", orders: 5, spent: 612000, joined: "Feb 2026", status: "Active" },
  { id: 3, name: "Fatima Abubakar", email: "fatima@email.com", phone: "+234 800 000 0003", orders: 2, spent: 190000, joined: "Mar 2026", status: "Active" },
  { id: 4, name: "Chidi Okafor", email: "chidi@email.com", phone: "+234 800 000 0004", orders: 1, spent: 72000, joined: "Apr 2026", status: "Inactive" },
  { id: 5, name: "Ngozi Eze", email: "ngozi@email.com", phone: "+234 800 000 0005", orders: 4, spent: 445000, joined: "Mar 2026", status: "Active" },
  { id: 6, name: "Ibrahim Musa", email: "ibrahim@email.com", phone: "+234 800 000 0006", orders: 2, spent: 217000, joined: "May 2026", status: "Active" },
];