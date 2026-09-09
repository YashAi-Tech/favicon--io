import {
  Rocket, LayoutDashboard, FileText, ShoppingBag, CheckSquare,
  Utensils, UserRound, CalendarDays, LineChart, Music,
} from "lucide-react";

// Ready-made starter templates. Each carries a rich prompt sent to the AI builder.
export const templates = [
  {
    id: "landing",
    name: "SaaS Landing Page",
    desc: "Hero, features, pricing & testimonials",
    icon: Rocket,
    tint: "#f9540b",
    prompt:
      "Build a modern, conversion-focused SaaS product landing page with a bold hero and CTA, a logo cloud, a 3-column features section, a pricing section with 3 tiers and a monthly/yearly toggle, testimonials, an FAQ, and a footer. Use a clean, contemporary look with smooth scroll animations.",
  },
  {
    id: "portfolio",
    name: "Personal Portfolio",
    desc: "Showcase your work & about you",
    icon: UserRound,
    tint: "#8b5cf6",
    prompt:
      "Build a sleek personal portfolio website with a hero introduction, an about section, a projects grid with hover cards, a skills list, a contact form, and social links. Make it elegant and minimal with subtle animations.",
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    desc: "Charts, tables & KPI cards",
    icon: LayoutDashboard,
    tint: "#0ea5e9",
    prompt:
      "Build an analytics admin dashboard with a left sidebar, top bar, KPI stat cards, a line chart and a bar chart (use Chart.js via CDN), a recent-activity table, and a clean modern data-app look.",
  },
  {
    id: "blog",
    name: "Blog",
    desc: "Article list & reader layout",
    icon: FileText,
    tint: "#22c55e",
    prompt:
      "Build a clean, readable blog with a featured post hero, a grid of article cards with categories and read time, a newsletter signup, and a single-article reading layout with typography-focused styling.",
  },
  {
    id: "store",
    name: "E-commerce Store",
    desc: "Product grid & cart drawer",
    icon: ShoppingBag,
    tint: "#ec4899",
    prompt:
      "Build an e-commerce storefront with a hero banner, a product grid with images, prices and add-to-cart buttons, a slide-in cart drawer that updates totals, category filters, and a checkout summary. Make it polished and shoppable.",
  },
  {
    id: "todo",
    name: "Task Manager",
    desc: "Add, complete & filter tasks",
    icon: CheckSquare,
    tint: "#f59e0b",
    prompt:
      "Build a productivity task manager app where users can add tasks, mark them complete, filter by all/active/completed, set priorities, and see a progress bar. Persist tasks in localStorage. Clean, focused UI.",
  },
  {
    id: "restaurant",
    name: "Restaurant Menu",
    desc: "Menu, gallery & reservations",
    icon: Utensils,
    tint: "#ef4444",
    prompt:
      "Build a restaurant website with an appetizing hero, an interactive menu with categories and prices, a photo gallery, opening hours, a reservation form, and a location map placeholder. Warm, tasteful design.",
  },
  {
    id: "event",
    name: "Event / Landing",
    desc: "Countdown, schedule & RSVP",
    icon: CalendarDays,
    tint: "#14b8a6",
    prompt:
      "Build an event landing page with a live countdown timer, event schedule/agenda, speaker cards, a venue section, ticket tiers, and an RSVP form. Energetic and modern.",
  },
];
