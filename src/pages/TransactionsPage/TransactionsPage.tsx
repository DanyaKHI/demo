import React, { useMemo, useState } from "react";
import {
  ActionIcon,
  Anchor,
  Button,
  Card,
  Group,
  Menu,
  NumberFormatter,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  SegmentedControl,
  Modal,
  Paper,
  Tooltip,
  Badge,
} from "@mantine/core";
import {
  IconAdjustments,
  IconChevronDown,
  IconChevronUp,
  IconDots,
  IconDownload,
  IconExternalLink,
  IconFilter,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import classes from "./TransactionsPage.module.scss";

type Currency = "RUR" | "USD" | "EUR";
type TxType = "money" | "bond" | "stock";

type Transaction = {
  id: string;
  date: string;
  ticker: string;
  name: string;
  type: TxType;
  qty: number;
  price: number;
  currency: Currency;
  fee: number;
  amount: number;
  reportId?: string;
  direction?: "input" | "output";
};

const MOCK: Transaction[] = [
  { id: "t1", date: "2024-06-24", ticker: "INPUT",  name: "Пополнение счета",  type: "money", qty: 1, price: 1, currency: "RUR", fee: 0, amount: 30_000_000, direction: "input",  reportId: "311747" },
  { id: "t2", date: "2024-06-24", ticker: "OUTPUT", name: "Вывод средств",     type: "money", qty: 1, price: 1, currency: "RUR", fee: 0, amount: -6_000_000, direction: "output", reportId: "311747" },
  { id: "t3", date: "2024-06-25", ticker: "INPUT",  name: "Пополнение счета",  type: "money", qty: 1, price: 1, currency: "RUR", fee: 0, amount: 6_000_000,  direction: "input",  reportId: "311747" },
  { id: "t4", date: "2024-06-27", ticker: "SU29014RMFS6", name: "ОФЗ-ПК 29014 25/03/26", type: "bond", qty: 4284, price: 100.039, currency: "RUR", fee: 1714.27, amount: -4_290_983.59, reportId: "311747" },
  { id: "t5", date: "2024-06-27", ticker: "SU29022RMFS9", name: "ОФЗ-ПК 29022 20/07/33", type: "bond", qty: 1185, price: 98.55,   currency: "RUR", fee: 467.13,  amount: -1_198_063.68, reportId: "311747" },
];

const NBSP = "\u00A0";
const kFmt = (n: number) => (
  <NumberFormatter value={n} thousandSeparator=" " decimalScale={2} />
);
const rubWords = (n: number) => {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const nf = (v: number) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(v);
  if (abs >= 1e9) return `${sign}${nf(abs / 1e9)}${NBSP}млрд${NBSP}₽`;
  if (abs >= 1e6) return `${sign}${nf(abs / 1e6)}${NBSP}млн${NBSP}₽`;
  if (abs >= 1e3) return `${sign}${nf(abs / 1e3)}${NBSP}тыс${NBSP}₽`;
  return `${sign}${new Intl.NumberFormat("ru-RU").format(abs)}${NBSP}₽`;
};

const typeChip: Record<TxType, { label: string; tone: string; icon: React.ReactNode }> = {
  money: { label: "Денежная", tone: "teal",   icon: <IconWallet size={14} /> },
  bond:  { label: "Облигация", tone: "violet", icon: <IconTrendingUp size={14} /> },
  stock: { label: "Акция",     tone: "blue",   icon: <IconTrendingDown size={14} /> },
};

const years = ["Все", "2022", "2023", "2024", "2025"];

export default function TransactionsPage() {
  const [q, setQ] = useState("");
  const [year, setYear] = useState<string>(years[0]);
  const [type, setType] = useState<TxType | "all">("all");
  const [range, _setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [sort, setSort] = useState<{ key: keyof Transaction; dir: "asc" | "desc" } | null>({
    key: "date",
    dir: "desc",
  });
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = useMemo(() => {
    let data = [...MOCK];

    if (year !== "Все") data = data.filter((r) => new Date(r.date).getFullYear().toString() === year);
    if (type !== "all") data = data.filter((r) => r.type === type);
    if (range[0]) data = data.filter((r) => new Date(r.date) >= (range[0] as Date));
    if (range[1]) data = data.filter((r) => new Date(r.date) <= (range[1] as Date));

    if (q.trim()) {
      const qq = q.toLowerCase();
      data = data.filter((r) => r.ticker.toLowerCase().includes(qq) || r.name.toLowerCase().includes(qq));
    }

    if (sort) {
      data.sort((a, b) => {
        const A = a[sort.key] as any;
        const B = b[sort.key] as any;
        const dir = sort.dir === "asc" ? 1 : -1;
        if (typeof A === "number" && typeof B === "number") return (A - B) * dir;
        return String(A).localeCompare(String(B)) * dir;
      });
    }
    return data;
  }, [q, year, type, range, sort]);

  const total = useMemo(() => filtered.reduce((sum, r) => sum + r.amount, 0), [filtered]);
  const feeTotal = useMemo(() => filtered.reduce((s, r) => s + r.fee, 0), [filtered]);

  const SortIcon = (key: keyof Transaction) => {
    if (!sort || sort.key !== key) return <IconChevronDown size={14} className={classes.thSortIcon} />;
    return sort.dir === "asc" ? (
      <IconChevronUp size={14} className={classes.thSortIconActive} />
    ) : (
      <IconChevronDown size={14} className={classes.thSortIconActive} />
    );
  };

  return (
    <Stack className={classes.page} gap="md">
      <div className={classes.headerWrap}>
        <Group justify="space-between" align="center" className={classes.headerRow}>
          <Group gap="sm">
            <div>
              <Group className={classes.kpiRow} gap="xl" wrap="nowrap">
                <div className={classes.kpi}>
                  <Text className={classes.kpiLabel}>Сделок</Text>
                  <Text className={classes.kpiValue}>{filtered.length}</Text>
                </div>
                <div className={classes.kpi}>
                  <Text className={classes.kpiLabel}>Итоговая сумма</Text>
                  <Text className={`${classes.kpiValue} ${total < 0 ? classes.neg : classes.pos}`}>{rubWords(total)}</Text>
                </div>
                <div className={classes.kpi}>
                  <Text className={classes.kpiLabel}>Комиссии</Text>
                  <Text className={classes.kpiValue}>{kFmt(feeTotal)} RUR</Text>
                </div>
              </Group>
            </div>
          </Group>

          <Group gap="xs" wrap="nowrap">
            <Button variant="default" leftSection={<IconPlus size={16} />}>Добавить</Button>
            <Button variant="default" leftSection={<IconDownload size={16} />} onClick={() => setExportOpen(true)}>Экспорт</Button>
            <ActionIcon variant="subtle" aria-label="refresh">
              <IconRefresh size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </div>

      <Card radius="xs" p="sm" className={classes.glassToolbar}>
        <Group gap="sm" align="center" wrap="nowrap" className={classes.toolbarRow}>
          <TextInput
            size="sm"
            leftSection={<IconSearch size={16} />}
            placeholder="Поиск: тикер или название"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            className={classes.search}
          />

          <SegmentedControl
            size="sm"
            radius="xl"
            data={years.map((y) => ({ value: y, label: y }))}
            value={year}
            onChange={setYear}
          />

          <Select
            size="sm"
            placeholder="Тип"
            value={type}
            onChange={(v) => setType((v as any) ?? "all")}
            data={[
              { value: "all", label: "Все" },
              { value: "money", label: "Денежные" },
              { value: "bond", label: "Облигации" },
              { value: "stock", label: "Акции" },
            ]}
            leftSection={<IconFilter size={16} />}
            w={210}
            radius="xl"
          />

        </Group>
      </Card>

      <Paper withBorder radius="xl" className={classes.tableWrap}>
        <ScrollArea type="auto">
          <Table
            highlightOnHover
            verticalSpacing="md"
            horizontalSpacing="md"
            className={classes.table}
            stickyHeader
            striped
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={classes.th} onClick={() => setSort({ key: "date", dir: sort?.dir === "asc" ? "desc" : "asc" })}>
                  <Group gap={6}>Дата {SortIcon("date")}</Group>
                </Table.Th>
                <Table.Th className={classes.th} onClick={() => setSort({ key: "ticker", dir: sort?.dir === "asc" ? "desc" : "asc" })}>
                  <Group gap={6}>Тикер {SortIcon("ticker")}</Group>
                </Table.Th>
                <Table.Th className={classes.th}>Название</Table.Th>
                <Table.Th className={classes.th} onClick={() => setSort({ key: "type", dir: sort?.dir === "asc" ? "desc" : "asc" })}>
                  <Group gap={6}>Тип {SortIcon("type")}</Group>
                </Table.Th>
                <Table.Th className={classes.th} ta="right" onClick={() => setSort({ key: "qty", dir: sort?.dir === "asc" ? "desc" : "asc" })}>
                  <Group gap={6} justify="end">Кол-во {SortIcon("qty")}</Group>
                </Table.Th>
                <Table.Th className={classes.th} ta="right" onClick={() => setSort({ key: "price", dir: sort?.dir === "asc" ? "desc" : "asc" })}>
                  <Group gap={6} justify="end">Цена {SortIcon("price")}</Group>
                </Table.Th>
                <Table.Th className={classes.th} ta="right">Сумма</Table.Th>
                <Table.Th className={classes.th} ta="right">Отчёт</Table.Th>
                <Table.Th className={classes.th} ta="center">Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {filtered.map((r) => (
                <Table.Tr key={r.id} className={r.amount < 0 ? classes.rowNegative : classes.rowPositive}>
                  {/* Дата */}
                  <Table.Td className={classes.tdDate}>
                    <Text fw={700}>{new Date(r.date).toLocaleDateString()}</Text>
                    <Text c="dimmed" fz="xs">
                      {new Date(r.date).toLocaleDateString(undefined, { weekday: "short" })}
                    </Text>
                  </Table.Td>

                  {/* Тикер */}
                  <Table.Td>
                    <Tooltip label={r.ticker}>
                      <span className={classes.tickerPill}>{r.ticker.slice(0, 4).toUpperCase()}…</span>
                    </Tooltip>
                  </Table.Td>

                  {/* Название + подтипы */}
                  <Table.Td>
                    <Text fw={600}>{r.name}</Text>
                    {r.type !== "money" && (
                      <span className={`${classes.badgeSoft} ${classes[`tone_${typeChip[r.type].tone}`]}`}>
                        {typeChip[r.type].icon}
                        <span>{typeChip[r.type].label}</span>
                      </span>
                    )}
                  </Table.Td>

                  {/* Тип */}
                  <Table.Td>
                    <Badge variant="light" color={typeChip[r.type].tone} radius="sm">
                      {typeChip[r.type].label}
                    </Badge>
                  </Table.Td>

                  {/* Кол-во / Цена */}
                  <Table.Td ta="right" className={classes.num}>{kFmt(r.qty)}</Table.Td>
                  <Table.Td ta="right" className={classes.num}>{kFmt(r.price)}</Table.Td>

                  <Table.Td ta="right">
                    <Text className={`${classes.num} ${r.amount < 0 ? classes.neg : classes.pos}`}>{kFmt(r.amount)}</Text>
                  </Table.Td>

                  <Table.Td ta="right">
                    {r.reportId ? (
                      <Anchor component="button" fz="sm" className={classes.link}>
                        {r.reportId}
                      </Anchor>
                    ) : (
                      <Text c="dimmed">—</Text>
                    )}
                  </Table.Td>

                  <Table.Td ta="center" className={classes.actionsCell}>
                    <Menu withinPortal position="bottom-end" shadow="md">
                      <Menu.Target>
                        <ActionIcon variant="subtle" aria-label="actions" className={classes.rowAction}>
                          <IconDots size={18} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconExternalLink size={16} />}>Открыть</Menu.Item>
                        <Menu.Item leftSection={<IconAdjustments size={16} />}>Изменить</Menu.Item>
                        <Menu.Item color="red">Удалить</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      <Modal opened={exportOpen} onClose={() => setExportOpen(false)} title="Экспорт сделок" centered>
        <Stack>
          <Text c="dimmed">Демо: скачайте CSV с текущей выборкой.</Text>
          <Group>
            <Button leftSection={<IconDownload size={16} />}>Скачать CSV</Button>
            <Button variant="default">XLSX</Button>
            <Button variant="default">PDF</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
