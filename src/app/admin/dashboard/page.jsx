"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiMenu,
  FiSearch,
  FiPlus,
  FiUpload,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiSettings,
  FiChevronRight,
  FiStar,
  FiBriefcase,
} from "react-icons/fi";
import {
  MdOutlineSpaceDashboard,
  MdOutlineArticle,
  MdOutlineCollectionsBookmark,
} from "react-icons/md";

const BRAND = {
  primary: "#234D7E", // your blue
  primaryDark: "#1D3F68",
  primarySoft: "rgba(35,77,126,0.10)",
  ink: "#0F1222",
};

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);

  // dummy data for visuals — replace with real data when you connect
  const stats = [
    { label: "Total Blogs", value: "128", delta: "+6 this week" },
    { label: "Projects", value: "54", delta: "+2 this week" },
    { label: "Drafts", value: "9", delta: "—" },
    { label: "Pending Reviews", value: "3", delta: "action needed" },
  ];

  const recentBlogs = [
    { title: "Design Systems That Scale", status: "Published", date: "Aug 13" },
    { title: "SEO Basics for 2025", status: "Draft", date: "Aug 11" },
    { title: "Faster Next.js Images", status: "Published", date: "Aug 08" },
  ];

  const recentProjects = [
    { title: "Aurora Homes", status: "Live", date: "Aug 12" },
    { title: "Cafe Botanica", status: "In Review", date: "Aug 10" },
    { title: "Vista Tower", status: "Live", date: "Aug 03" },
  ];

  return (
    <div className="min-h-screen  bg-[#F3F1EB] text-[#0F1222]">
      {/* background halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, rgba(35,77,126,.20), rgba(35,77,126,0) 70%)",
        }}
      />

      {/* Topbar */}
    

      <div className="max-w-7xl  mx-auto px-4 sm:px-0">
        {/* Sidebar + content */}
        <div className="md:grid md:grid-cols-[220px_1fr] md:gap-8">
          {/* Sidebar */}
          <aside
            className={`${
              open ? "block" : "hidden"
            } md:block md:sticky md:top-20 self-start mt-6`}
          >
            <nav className="rounded-2xl border border-zinc-100 bg-white shadow-[0_10px_30px_rgba(17,17,26,0.04)]">
              <div className="px-4 py-3 text-xs uppercase tracking-wide text-zinc-500">
                Manage
              </div>
              <ul className="px-2 pb-2">
                <SideItem
                  href="/admin/dashboard"
                  icon={<MdOutlineSpaceDashboard />}
                  label="Overview"
                  active
                />
                <SideItem
                  href="/admin/dashboard/blogs"
                  icon={<MdOutlineArticle />}
                  label="Blogs"
                />
                <SideItem
                  href="/admin/dashboard/projects"
                  icon={<MdOutlineCollectionsBookmark />}
                  label="Projects"
                />
                <SideItem
                  href="/admin/dashboard/upload-project"
                  icon={<FiUpload />}
                  label="Upload Project"
                />
                <SideItem
                  href="/admin/dashboard/featured-projects"
                  icon={<FiStar />}
                  label="Featured Projects"
                />
                <SideItem
                  href="/admin/dashboard/jobs"
                  icon={<FiBriefcase />}
                  label="Jobs"
                />
              </ul>

              <div className="px-4 py-3 text-xs uppercase tracking-wide text-zinc-500 border-t border-zinc-100">
                Account
              </div>
              <ul className="px-2 pb-4">
                 <SideItem href="#" icon={<FiLogOut />} label="Logout" />
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="mt-6 md:mt-20">
            {/* Welcome panel */}
            <section className="relative overflow-hidden rounded-3xl border border-zinc-100 bg-gradient-to-br from-white via-[rgba(35,77,126,0.06)] to-white p-6 md:p-8">
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(45% 45% at 50% 50%, rgba(35,77,126,.20), rgba(35,77,126,0))",
                }}
              />
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Welcome back, Admin 👋
              </h1>
              <p className="mt-2 text-zinc-600 max-w-2xl">
                Quick snapshot of your content. Create, edit, and publish with a
                single click.
              </p>

              
            </section>

            {/* Quick actions */}
            <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActionCard
                href="/admin/dashboard/blogs"
                icon={<FiFileText />}
                title="Manage Blogs"
                desc="Create, edit and publish articles."
              />
              <ActionCard
                href="/admin/dashboard/projects"
                icon={<FiGrid />}
                title="Manage Projects"
                desc="Organize and showcase your work."
              />
              <ActionCard
                href="/admin/dashboard/upload-project"
                icon={<FiUpload />}
                title="Upload Project"
                desc="Add a new project with images & meta."
                primary
              />
              <ActionCard
                href="/admin/dashboard/featured-projects"
                icon={<FiStar />}
                title="Featured Projects"
                desc="Promote or curate homepage spotlight."
                primary
              />
              <ActionCard
                href="/admin/dashboard/jobs"
                icon={<FiBriefcase />}
                title="Manage Jobs"
                desc="Post, edit, and close roles."
                primary
              />
            </section>

            {/* Tables */}
            {/* <section className="mt-8 grid lg:grid-cols-2 gap-6">
              <GlassPanel title="Recent Blogs">
                <Table
                  cols={["Title", "Status", "Date"]}
                  rows={recentBlogs.map((b) => [b.title, b.status, b.date])}
                />
                <FooterLink href="/admin/dashboard/blogs" label="View all blogs" />
              </GlassPanel>

              <GlassPanel title="Recent Projects">
                <Table
                  cols={["Title", "Status", "Date"]}
                  rows={recentProjects.map((p) => [p.title, p.status, p.date])}
                />
                <FooterLink href="/admin/dashboard/projects" label="View all projects" />
              </GlassPanel>
            </section> */}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- UI Subcomponents --------------------------- */

function SideItem({ href, icon, label, active }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
          active
            ? "bg-[rgba(35,77,126,0.08)] text-[color:#234D7E]"
            : "text-zinc-700 hover:bg-zinc-50"
        }`}
      >
        <span className="text-[18px]">{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

function StatCard({ label, value, delta }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-[0_10px_30px_rgba(17,17,26,0.04)]">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{delta}</div>
    </div>
  );
}

function ActionCard({ href, icon, title, desc, primary }) {
  return (
    <Link
      href={href}
      className={`group block rounded-2xl border border-zinc-100 bg-white p-5 shadow-[0_10px_30px_rgba(17,17,26,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(35,77,126,0.12)] ${
        primary ? "ring-1 ring-[rgba(35,77,126,0.18)]" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{ background: BRAND.primarySoft, color: BRAND.primary }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <p className="text-sm text-zinc-600">{desc}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm font-medium text-[color:#234D7E]">
        Go
        <FiChevronRight className="ml-1 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function GlassPanel({ title, children }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white/90 backdrop-blur p-5 shadow-[0_10px_30px_rgba(17,17,26,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-[15px] font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Table({ cols, rows }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-100">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50/60">
          <tr>
            {cols.map((c) => (
              <th key={c} className="px-3 py-2 text-left font-medium text-zinc-600">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-zinc-50/50">
              {r.map((cell, j) => (
                <td key={j} className="px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FooterLink({ href, label }) {
  return (
    <div className="mt-3 flex justify-end">
      <Link
        href={href}
        className="text-sm font-medium text-[color:#234D7E] hover:underline"
      >
        {label}
      </Link>
    </div>
  );
}