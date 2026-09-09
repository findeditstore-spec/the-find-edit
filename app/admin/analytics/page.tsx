"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/supabase";

export default function AnalyticsPage() {
    const [clicks, setClicks] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState("");
const [dateRange, setDateRange] = useState("all");
const [productCategories, setProductCategories] = useState<
  Record<string, string>
>({});

useEffect(() => {
  async function loadClicks() {
    const { data, error } = await supabase
      .from("product_clicks")
      .select("id, product_id, product_name, store, clicked_at")
      .order("clicked_at", { ascending: false });

    if (error) {
      console.error("Error loading analytics:", error);
      setErrorMessage("Unable to load analytics data.");
      setLoading(false);
      return;
    }

    setClicks(data ?? []);

const productIds = (data ?? []).map((click) => click.product_id);

if (productIds.length > 0) {
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, category")
    .in("id", productIds);

  if (productsError) {
    console.error("Error loading product categories:", productsError);
  } else {
    const categoryMap: Record<string, string> = {};

    (products ?? []).forEach((product) => {
      categoryMap[product.id] = product.category;
    });

    setProductCategories(categoryMap);
  }
}

setLoading(false);
  }

  loadClicks();
}, []);

const filteredClicks = clicks.filter((click) => {
  if (dateRange === "all") {
    return true;
  }

  const clickDate = new Date(click.clicked_at);
  const now = new Date();

  if (dateRange === "7") {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    return clickDate >= sevenDaysAgo;
  }

  if (dateRange === "30") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    return clickDate >= thirtyDaysAgo;
  }

  if (dateRange === "year") {
    return clickDate.getFullYear() === now.getFullYear();
  }

  return true;
});

const totalClicks = filteredClicks.length;

const uniqueProducts = new Set(
  filteredClicks.map((click) => click.product_id)
).size;

const retailerCounts = filteredClicks.reduce(
  (counts: Record<string, number>, click) => {
    counts[click.store] = (counts[click.store] || 0) + 1;
    return counts;
  },
  {}
);

const topRetailer =
  Object.entries(retailerCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || "—";

  const topRetailers = Object.entries(retailerCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

  const categoryCounts = filteredClicks.reduce(
  (counts: Record<string, number>, click) => {
    const category = productCategories[click.product_id];

    if (category) {
      counts[category] = (counts[category] || 0) + 1;
    }

    return counts;
  },
  {}
);

const topCategories = Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1]);

 const productCounts = filteredClicks.reduce(
  (
    counts: Record<
      string,
      {
        name: string;
        store: string;
        clicks: number;
      }
    >,
    click
  ) => {
    if (!counts[click.product_id]) {
      counts[click.product_id] = {
        name: click.product_name,
        store: click.store,
        clicks: 0,
      };
    }

    counts[click.product_id].clicks += 1;

    return counts;
  },
  {}
);

const topProducts = Object.values(productCounts)
  .sort((a, b) => b.clicks - a.clicks)
  .slice(0, 10);

 const clicksByDay = filteredClicks.reduce(
  (counts: Record<string, number>, click) => {
    const date = new Date(click.clicked_at).toLocaleDateString(
      "en-CA",
      {
        timeZone: "Africa/Johannesburg",
      }
    );

    counts[date] = (counts[date] || 0) + 1;

    return counts;
  },
  {}
);

const sortedDates = Object.keys(clicksByDay).sort();

const clicksOverTime: { date: string; clicks: number }[] = [];

if (sortedDates.length > 0) {
  const startDate = new Date(`${sortedDates[0]}T12:00:00`);
  const endDate = new Date(
    `${sortedDates[sortedDates.length - 1]}T12:00:00`
  );

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const date = currentDate.toLocaleDateString("en-CA");

    clicksOverTime.push({
      date,
      clicks: clicksByDay[date] || 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }
}

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#1F2937]">
      {/* Header */}
      <header className="border-b border-[#EAE6DF] px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/admin"
            className="text-xl font-semibold tracking-wide"
          >
            The Find Edit
          </a>

          <a
            href="/admin"
            className="text-sm text-[#5B6470] transition hover:text-[#176B6B]"
          >
            ← Back to Admin
          </a>
        </div>
      </header>

      {/* Content */}
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#176B6B]">
            Analytics
          </p>

          <h1 className="font-serif text-5xl font-medium tracking-tight md:text-7xl">
            Understand what people are finding.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5B6470]">
            Track product clicks, retailer activity and the finds getting the
            most attention.
          </p>

          <div className="mt-8">
  <select
    value={dateRange}
    onChange={(event) => setDateRange(event.target.value)}
    className="rounded-full border border-[#EAE6DF] bg-white px-5 py-3 text-sm text-[#5B6470] outline-none transition focus:border-[#176B6B]"
  >
    <option value="all">All time</option>
    <option value="7">Last 7 days</option>
    <option value="30">Last 30 days</option>
    <option value="year">This year</option>
  </select>
</div>

          {/* Analytics Overview */}
<div className="mt-16 grid gap-6 md:grid-cols-3">
  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8">
    <p className="text-sm text-[#7A827D]">
      Total Clicks
    </p>

    <p className="mt-4 text-4xl font-medium">
      {loading ? "—" : totalClicks}
    </p>
  </div>

  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8">
    <p className="text-sm text-[#7A827D]">
      Unique Products
    </p>

    <p className="mt-4 text-4xl font-medium">
      {loading ? "—" : uniqueProducts}
    </p>
  </div>

  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8">
    <p className="text-sm text-[#7A827D]">
      Top Retailer
    </p>

    <p className="mt-4 text-4xl font-medium">
      {loading ? "—" : topRetailer}
    </p>
  </div>
  </div>

  {/* Top Products */}
<div className="mt-10 rounded-2xl border border-[#EAE6DF] bg-white p-8 md:p-10">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-[#7A827D]">
        Product Performance
      </p>

      <h2 className="mt-2 font-serif text-3xl font-medium">
        Most-clicked products
      </h2>
    </div>
  </div>

  <div className="mt-8 divide-y divide-[#EAE6DF]">
    {loading ? (
      <p className="py-6 text-sm text-[#7A827D]">
        Loading analytics...
      </p>
    ) : topProducts.length === 0 ? (
      <p className="py-6 text-sm text-[#7A827D]">
        No product clicks yet.
      </p>
    ) : (
      topProducts.map((product, index) => (
        <div
          key={`${product.name}-${product.store}`}
          className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-start gap-4">
            <span className="text-sm text-[#7A827D]">
              {index + 1}
            </span>

            <div>
              <p className="font-medium">
                {product.name}
              </p>

              <p className="mt-1 text-sm text-[#7A827D]">
                {product.store}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-[#176B6B]">
            {product.clicks} {product.clicks === 1 ? "click" : "clicks"}
          </p>
        </div>
      ))
    )}
  </div>
</div>

{/* Retailer & Category Performance */}
<div className="mt-8 grid gap-6 lg:grid-cols-2">

  {/* Retailer Performance */}
  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8 md:p-10">
    <div>
      <p className="text-sm text-[#7A827D]">
        Retailer Performance
      </p>

      <h2 className="mt-2 font-serif text-3xl font-medium">
        Most-clicked retailers
      </h2>
    </div>

    <div className="mt-8 divide-y divide-[#EAE6DF]">
      {loading ? (
        <p className="py-6 text-sm text-[#7A827D]">
          Loading analytics...
        </p>
      ) : topRetailers.length === 0 ? (
        <p className="py-6 text-sm text-[#7A827D]">
          No retailer clicks yet.
        </p>
      ) : (
        topRetailers.map(([store, count], index) => (
          <div
            key={store}
            className="flex items-center justify-between py-5"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#7A827D]">
                {index + 1}
              </span>

              <p className="font-medium">
                {store}
              </p>
            </div>

            <p className="text-sm font-medium text-[#176B6B]">
              {count} {count === 1 ? "click" : "clicks"}
            </p>
          </div>
        ))
      )}
    </div>
  </div>

  {/* Category Performance */}
  <div className="rounded-2xl border border-[#EAE6DF] bg-white p-8 md:p-10">
    <div>
      <p className="text-sm text-[#7A827D]">
        Category Performance
      </p>

      <h2 className="mt-2 font-serif text-3xl font-medium">
        Most-clicked categories
      </h2>
    </div>

    <div className="mt-8 divide-y divide-[#EAE6DF]">
      {loading ? (
        <p className="py-6 text-sm text-[#7A827D]">
          Loading analytics...
        </p>
      ) : topCategories.length === 0 ? (
        <p className="py-6 text-sm text-[#7A827D]">
          No category clicks yet.
        </p>
      ) : (
        topCategories.map(([category, count], index) => (
          <div
            key={category}
            className="flex items-center justify-between py-5"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#7A827D]">
                {index + 1}
              </span>

              <p className="font-medium">
                {category}
              </p>
            </div>

            <p className="text-sm font-medium text-[#176B6B]">
              {count} {count === 1 ? "click" : "clicks"}
            </p>
          </div>
        ))
      )}
    </div>
  </div>

</div>

{/* Clicks Over Time */}
<div className="mt-10 rounded-2xl border border-[#EAE6DF] bg-white p-8 md:p-10">
  <div>
    <p className="text-sm text-[#7A827D]">
      Traffic
    </p>

    <h2 className="mt-2 font-serif text-3xl font-medium">
      Clicks Over Time
    </h2>
  </div>

  <div className="mt-8">
    {loading ? (
      <p className="py-6 text-sm text-[#7A827D]">
        Loading analytics...
      </p>
    ) : clicksOverTime.length === 0 ? (
      <p className="py-6 text-sm text-[#7A827D]">
        No click data yet.
      </p>
    ) : (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={clicksOverTime}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#EAE6DF"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(`${value}T00:00:00`).toLocaleDateString(
                  "en-ZA",
                  {
                    day: "numeric",
                    month: "short",
                  }
                )
              }
              tick={{ fill: "#7A827D", fontSize: 12 }}
              axisLine={{ stroke: "#EAE6DF" }}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: "#7A827D", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              labelFormatter={(value) =>
                new Date(`${value}T00:00:00`).toLocaleDateString(
                  "en-ZA",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )
              }
            />

            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#176B6B"
              strokeWidth={2.5}
              dot={{ fill: "#176B6B", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
</div>
        </div>
      </section>
    </main>
  );
}