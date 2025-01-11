"use client";

import ComponentLoader from "@/components/ComponentLoader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetDailyOrderStatsQuery,
  useGetOrderStatusDistributionQuery,
  useGetPaymentMethodStatsQuery,
  useGetPopularProductsQuery,
} from "@/redux/features/orders/orderApi";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const OrderAnalytics = () => {
  const { data: dailyStats, isLoading: isDailyLoading } =
    useGetDailyOrderStatsQuery({});
  const { data: statusStats, isLoading: isStatusLoading } =
    useGetOrderStatusDistributionQuery({});
  const { data: popularProducts, isLoading: isProductsLoading } =
    useGetPopularProductsQuery({});
  const { data: paymentStats, isLoading: isPaymentLoading } =
    useGetPaymentMethodStatsQuery({});

  if (
    isDailyLoading ||
    isStatusLoading ||
    isProductsLoading ||
    isPaymentLoading
  ) {
    return <ComponentLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Order Analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Badge>{dailyStats?.data?.totalOrders}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyStats?.data?.reduce(
                (sum: number, item: any) => sum + item.orders,
                0
              )}
            </div>
          </CardContent>
        </Card>
        {/* Add more metric cards */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Orders Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Orders Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats?.data}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="_id" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats?.data}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusStats?.data?.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Products */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularProducts?.data}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalOrders" fill="#8884d8" />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStats?.data}
                  dataKey="totalAmount"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {paymentStats?.data?.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderAnalytics;
