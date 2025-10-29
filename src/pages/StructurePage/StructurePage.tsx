import { useMemo, useState } from "react";
import {
  Badge,
  Card,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  PieChart,
  BarChart,
  LineChart,
  RadarChart,
} from "@mantine/charts";
import {
  IconSearch,
} from "@tabler/icons-react";
import classes from "./StructurePage.module.scss";

const categories = [
  { name: "Облигации", value: 28_574_245 },
  { name: "Валюта", value: 1_114_596 },
  { name: "Акции", value: 356_000 },
];

const currencies = [
  { name: "RUB", value: 29_688_841.13 },
  { name: "USD", value: 0 },
  { name: "EUR", value: 0 },
];

const byIssuer = [
  { name: "ОФЗ 29014", value: 0.152 },
  { name: "ОФЗ 29022", value: 0.144 },
  { name: "ОФЗ 26224", value: 0.101 },
  { name: "НорНик БО9", value: 0.104 },
  { name: "РЖД 1Р-26R", value: 0.104 },
  { name: "ГТЛК 2Р-03", value: 0.104 },
  { name: "Автодор3Р1", value: 0.058 },
  { name: "ЛСР БО 1Р8", value: 0.056 },
  { name: "ГазКап2Р12", value: 0.061 },
  { name: "СамолетР11", value: 0.055 },
  { name: "ЕвроПлин1Р3", value: 0.037 },
  { name: "ЖКФБанкБО4", value: 0.031 },
  { name: "Казахст07", value: 0.028 },
  { name: "БорецК1Р01", value: 0.028 },
  { name: "ЛЕГЕНДА2Р3", value: 0.026 },
  { name: "БДеньг-2Р6", value: 0.025 },
];

const perf = Array.from({ length: 24 }).map((_, i) => ({
  month: i + 1,
  income: Math.round(20_000 + Math.sin(i / 2) * 15_000 + i * 800),
  value: 28_000_000 + i * 350_000 + (Math.sin(i / 4) + 1) * 120_000,
}));

const sectors = [
  { sector: "Гос.", value: 36 },
  { sector: "Финансы", value: 18 },
  { sector: "Инфра", value: 14 },
  { sector: "Металлургия", value: 10 },
  { sector: "Недвиж.", value: 8 },
  { sector: "Энергетика", value: 7 },
  { sector: "Другое", value: 7 },
];

const ratings = [
  { rating: "AAA", value: 32 },
  { rating: "AA", value: 41 },
  { rating: "A", value: 20 },
  { rating: "BBB", value: 7 },
];

const risks = [
  { metric: "Дюрация", you: 3.1, benchmark: 3.6 },
  { metric: "Срок", you: 2.4, benchmark: 2.9 },
  { metric: "Кредитный", you: 2.1, benchmark: 2.6 },
  { metric: "Валюта", you: 0.3, benchmark: 0.2 },
  { metric: "Ликвидность", you: 1.2, benchmark: 1.5 },
];

const NBSP = "\u00A0";
const fmtRUB = (n: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  }).format(n);

const fmtRubCompact = (n: number) => {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const nf = (v: number) =>
    new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(v);
  if (abs >= 1e9) return `${sign}${nf(abs / 1e9)}${NBSP}млрд${NBSP}₽`;
  if (abs >= 1e6) return `${sign}${nf(abs / 1e6)}${NBSP}млн${NBSP}₽`;
  if (abs >= 1e3) return `${sign}${nf(abs / 1e3)}${NBSP}тыс${NBSP}₽`;
  return `${sign}${new Intl.NumberFormat("ru-RU").format(abs)}${NBSP}₽`;
};


const makeAxisRubFormatter =
  (max: number) =>
  (v: number) => {
    if (max >= 10_000_000) return `${Math.round(v / 1e6)}${NBSP}млн${NBSP}₽`;
    if (max >= 1_000_000) return `${(v / 1e6).toFixed(1)}${NBSP}млн${NBSP}₽`;
    return `${Math.round(v / 1e3)}${NBSP}тыс${NBSP}₽`;
  };

const palette = ["teal.6", "grape.6", "violet.6", "cyan.6", "indigo.6", "blue.6"];

const toPct = (value: number, total: number) =>
  Math.round((value / total) * 1000) / 10;

export default function StructurePage() {
  const [viewIssuer, setViewIssuer] = useState<"pie" | "bars">("pie");
  const [q, setQ] = useState("");

  const totalCategory = useMemo(
    () => categories.reduce((s, x) => s + x.value, 0),
    []
  );

  const issuersFiltered = useMemo(
    () =>
      byIssuer
        .filter((i) => i.name.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => b.value - a.value),
    [q]
  );

  const perfMaxValue = Math.max(...perf.map((p) => p.value));

  return (
    <Stack className={classes.page} gap="lg">

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        <Card withBorder radius="lg" className={classes.kpi}>
          <Text c="dimmed" fz="xs">
            Всего позиций
          </Text>
          <Text fw={800} fz={24}>
            {byIssuer.length}
          </Text>
        </Card>

        <Card withBorder radius="lg" className={classes.kpi}>
          <Text c="dimmed" fz="xs">
            Облигаций, % портфеля
          </Text>
          <Text fw={800} fz={24}>
            {toPct(categories[0].value, totalCategory)}%
          </Text>
        </Card>

        <Card withBorder radius="lg" className={classes.kpi}>
          <Text c="dimmed" fz="xs">
            Стоимость портфеля
          </Text>
          <Text fw={800} fz={24}>
            {fmtRubCompact(29_688_841)}
          </Text>
        </Card>
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, lg: 1 }} spacing="lg">
        <Card withBorder radius="lg" p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text fw={700}>Секторная структура</Text>
          </Group>
          <BarChart
            h={260}
            data={sectors}
            dataKey="sector"
            series={[{ name: "value", label: "%", color: "indigo.6" }]}
            gridAxis="y"
            withLegend={false}
            barProps={{ radius: 6 }}
          />
        </Card>
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <Card withBorder radius="lg" p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text fw={700}>По категориям</Text>
            <Badge variant="light">{fmtRUB(totalCategory)}</Badge>
          </Group>
          <PieChart
            withLabels
            labelsPosition="outside"
            labelsType="percent"
            withTooltip
            data={categories.map((c, i) => ({
              name: c.name,
              value: c.value,
              color: palette[i % palette.length],
            }))}
            strokeWidth={1}
            className={classes.chart}
          />
        </Card>

        <Card withBorder radius="lg" p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text fw={700}>Валюты</Text>
          </Group>
          <PieChart
            withLabels
            labelsPosition="outside"
            labelsType="percent"
            withTooltip
            data={currencies
              .filter((c) => c.value > 0) // не рисуем пустые сегменты
              .map((c, i) => ({
                name: c.name,
                value: c.value,
                color: palette[i % palette.length],
              }))}
            strokeWidth={1}
            className={classes.chart}
          />
        </Card>
      </SimpleGrid>

      {/* ISSUERS + PERFORMANCE */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <Card withBorder radius="lg" p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text fw={700}>Топ-эмитенты</Text>
            <SegmentedControl
              size="xs"
              value={viewIssuer}
              onChange={(v) => setViewIssuer(v as any)}
              data={[
                { value: "pie", label: "Круг" },
                { value: "bars", label: "Столбики" },
              ]}
            />
          </Group>

          {viewIssuer === "pie" ? (
            <PieChart
              withLabels
              labelsType="percent"
              labelsPosition="outside"
              withTooltip
              data={issuersFiltered.map((i, idx) => ({
                name: i.name,
                value: i.value,
                color: palette[idx % palette.length],
              }))}
              className={classes.chart}
            />
          ) : (
            <>
              <TextInput
                leftSection={<IconSearch size={14} />}
                placeholder="Фильтр эмитентов"
                value={q}
                onChange={(e) => setQ(e.currentTarget.value)}
                mb="xs"
              />
              <BarChart
                h={320}
                data={issuersFiltered.map((i) => ({
                  issuer: i.name,
                  pct: Math.round(i.value * 1000) / 10,
                }))}
                dataKey="issuer"
                series={[{ name: "pct", label: "%", color: "grape.6" }]}
                gridAxis="y"
                withLegend={false}
                barProps={{ radius: 6 }}
              />
            </>
          )}
        </Card>

        <Card withBorder radius="lg" p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text fw={700}>Динамика стоимости и дохода</Text>
          </Group>
          <LineChart
            h={320}
            data={perf}
            dataKey="month"
            series={[
              { name: "value", label: "Стоимость", color: "blue.6" },
              { name: "income", label: "Доход", color: "teal.6" },
            ]}
            curveType="monotone"
            withLegend
            gridAxis="xy"
            yAxisProps={{
              tickFormatter: makeAxisRubFormatter(perfMaxValue),
            }}
            valueFormatter={(v) => fmtRUB(v as number)}
          />
        </Card>
      </SimpleGrid>

      {/* RATINGS + RISKS */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <Card withBorder radius="lg" p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text fw={700}>Кредитные рейтинги</Text>
          </Group>
          <BarChart
            h={260}
            data={ratings}
            dataKey="rating"
            series={[{ name: "value", label: "%", color: "orange.6" }]}
            gridAxis="x"
            withLegend={false}
            barProps={{ radius: 6 }}
          />
        </Card>

        <Card withBorder radius="lg" p="md">
          <Group justify="space-between" align="center" mb="xs">
            <Text fw={700}>Риски (сравнение с бенчмарком)</Text>
          </Group>
          <RadarChart
            h={260}
            data={risks}
            dataKey="metric"
            series={[
              { name: "you", label: "Портфель", color: "violet.6" },
              { name: "benchmark", label: "Бенч.", color: "gray.6" },
            ]}
            withPolarRadiusAxis
          />
        </Card>
      </SimpleGrid>

      <Card withBorder radius="lg" p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Text fw={700}>Последние 6 месяцев</Text>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 6 }} spacing="md">
          {perf.slice(-6).map((p) => (
            <Card key={p.month} radius="md" className={classes.tile} withBorder>
              <Text fw={700} className={classes.nowrap}>
                {fmtRubCompact(p.value)}
              </Text>
              <Text fz="xs" c="dimmed">
                доход {fmtRubCompact(p.income)}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Card>
    </Stack>
  );
}
