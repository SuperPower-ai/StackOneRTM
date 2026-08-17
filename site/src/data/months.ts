export type MonthStatus = "published" | "forthcoming";

export type MonthInfo = {
  number: number;
  slug: string;
  title: string;
  blurb: string;
  phase: string;
  status: MonthStatus;
};

export const MONTHS: MonthInfo[] = [
  {
    number: 1,
    slug: "month-01",
    title: "Computer, Internet, CLI, Git, Architecture",
    blurb: "The machine, the network, HTTP, Git, and how a web system is shaped.",
    phase: "Foundations",
    status: "published",
  },
  {
    number: 2,
    slug: "month-02",
    title: "HTML, CSS, Accessibility, Responsive UI",
    blurb: "Documents, forms, cascade, Flex, Grid — then Project 1.",
    phase: "Foundations",
    status: "published",
  },
  {
    number: 3,
    slug: "month-03",
    title: "JavaScript Fundamentals",
    blurb: "Language, DOM, events, fetch — then Project 2.",
    phase: "Foundations",
    status: "published",
  },
  {
    number: 4,
    slug: "month-04",
    title: "Deep JavaScript, Tests, Advanced Git",
    blurb: "Closures, the event loop, tests, pull requests, a broken-app gate.",
    phase: "Foundations",
    status: "published",
  },
  {
    number: 5,
    slug: "month-05",
    title: "TypeScript and Frontend Tooling",
    blurb: "Types, npm, Vite — convert Project 2 into Project 3.",
    phase: "Foundations",
    status: "published",
  },
  {
    number: 6,
    slug: "month-06",
    title: "React + TypeScript Fundamentals",
    blurb: "Components, router, RTL — start Project 4.",
    phase: "Modern frontend",
    status: "published",
  },
  {
    number: 7,
    slug: "month-07",
    title: "Query, Forms, State, Performance",
    blurb: "TanStack Query, RHF, Zod — finish Project 4.",
    phase: "Modern frontend",
    status: "published",
  },
  {
    number: 8,
    slug: "month-08",
    title: "Python Engineering Foundations",
    blurb: "Python, uv, Ruff, pytest — Project 5 CLI.",
    phase: "Python and backend",
    status: "published",
  },
  {
    number: 9,
    slug: "month-09",
    title: "FastAPI and API Engineering",
    blurb: "Pydantic, OpenAPI, in-memory APIs — Project 6A.",
    phase: "Python and backend",
    status: "published",
  },
  {
    number: 10,
    slug: "month-10",
    title: "SQL and PostgreSQL",
    blurb: "Relational modeling and SQL you can trust.",
    phase: "Python and backend",
    status: "forthcoming",
  },
  {
    number: 11,
    slug: "month-11",
    title: "SQLAlchemy, Alembic, Redis",
    blurb: "ORM, migrations, and a cache — still earned, not copied.",
    phase: "Python and backend",
    status: "forthcoming",
  },
  {
    number: 12,
    slug: "month-12",
    title: "Full-Stack Integration",
    blurb: "One product: browser, API, and database in conversation.",
    phase: "Full-stack application",
    status: "forthcoming",
  },
  {
    number: 13,
    slug: "month-13",
    title: "Authentication, Authorization, Security",
    blurb: "Sessions, tokens, permissions, and threat models.",
    phase: "Full-stack application",
    status: "forthcoming",
  },
  {
    number: 14,
    slug: "month-14",
    title: "Testing, Quality, Reliability",
    blurb: "Tests that protect a real system, not a tutorial.",
    phase: "Full-stack application",
    status: "forthcoming",
  },
  {
    number: 15,
    slug: "month-15",
    title: "Linux, Docker, Observability",
    blurb: "The machine in production: processes, containers, logs.",
    phase: "Production engineering",
    status: "forthcoming",
  },
  {
    number: 16,
    slug: "month-16",
    title: "CI/CD and AWS",
    blurb: "Ship on a pipeline. Run on a cloud you can explain.",
    phase: "Production engineering",
    status: "forthcoming",
  },
  {
    number: 17,
    slug: "month-17",
    title: "Performance and Distributed Thinking",
    blurb: "Measure, queues, and the shape of larger systems.",
    phase: "Advanced engineering",
    status: "forthcoming",
  },
  {
    number: 18,
    slug: "month-18",
    title: "Production Master Project",
    blurb: "The capstone: design, build, operate, and defend it.",
    phase: "Capstone",
    status: "forthcoming",
  },
];

export function monthInfo(n: number): MonthInfo | undefined {
  return MONTHS.find((m) => m.number === n);
}
