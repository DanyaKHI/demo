import React from 'react';
import {
  Accordion,
  Anchor,
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { BarChart, DonutChart } from '@mantine/charts';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCash,
  IconCircleCheck,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import styles from './SummaryPage.module.scss';

const MOCK = {
  updatedAt: '28.10.2025 19:10',
  horizon: '1 год 4 месяца 5 дней',
  balance: 29_682_560.57,
  byAsset: {
    stocks: 5_234_000.0,
    funds: 1_980_000.0,
    bonds: 28_567_964.59,
    cash: 1_114_595.98,
    cashDetail: [{ currency: 'RUB', amount: 1_114_595.98 }],
  },
  today: { pnl: -151_233.05, pnlPct: -0.51, breakdown: { stocks: -37_420.25, bonds: -97_810.55, funds: -16_002.25 } },
  invested: { investedNow: 29_897_867.0, deposited: 36_000_000.0, thisYear: 1_200_000.0, withdrawn: -6_102_133.0, turnover: 33_335_965.94 },
  income: {
    total: 7_050_307.87,
    priceChange: 672_630.8,
    couponsAndDivs: 6_408_698.34,
    dividends: 882_104.04,
    coupons: 5_526_594.3,
    toBroker: 1_117_104.04,
    toBank: 5_291_594.3,
    fees: -13_154.27,
    taxes: -17_867.0,
    avgMonthly: 430_772.0,
    avgYearly: 5_241_063.0,
    monthlyIncome: [310_000, 365_000, 402_000, 418_000, 377_000, 450_000, 475_000, 489_000, 512_000, 498_000, 520_000, 534_000],
  },
  returns: { xirr: 18.55, aar: 19.27 },
  deviations: {
    maxProfitDate: '2025-10-27',
    maxProfit: 7_201_540.92,
    balanceAtMax: 29_833_793.62,
    fromMaxAbs: -151_233.05,
    fromMaxPct: -0.51,
    fromInvestedPct: 23.58,
    maxDrawdownDate: '2025-10-28',
    maxDrawdownAbs: -151_233.05,
    maxDrawdownPct: -0.51,
    incomeAtMaxDD: 7_050_307.87,
  },
  timeline: [
    26_800_000, 27_050_000, 27_180_000, 27_320_000, 27_500_000, 27_640_000, 27_790_000, 27_930_000, 28_010_000, 28_160_000,
    28_290_000, 28_420_000, 28_550_000, 28_600_000, 28_690_000, 28_830_000, 28_990_000, 29_020_000, 29_140_000, 29_280_000,
    29_340_000, 29_410_000, 29_490_000, 29_550_000, 29_620_000, 29_700_000, 29_780_000, 29_860_000, 29_833_793.62, 29_682_560.57,
  ],
  movers: [
    { name: 'ОФЗ 26238', change: -0.32 },
    { name: 'СберП', change: -0.18 },
    { name: 'VTB Биржевой', change: -0.07 },
  ],
};

const NBSP = '\u00A0';
const fmtRUB = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

function fmtRUBWords(n: number) {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  const nf = (v: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(v);
  if (abs >= 1e9) return `${sign}${nf(abs / 1e9)}${NBSP}млрд${NBSP}₽`;
  if (abs >= 1e6) return `${sign}${nf(abs / 1e6)}${NBSP}млн${NBSP}₽`;
  if (abs >= 1e3) return `${sign}${nf(abs / 1e3)}${NBSP}тыс${NBSP}₽`;
  return `${sign}${new Intl.NumberFormat('ru-RU').format(abs)}${NBSP}₽`;
}

const makeAxisRubFormatter =
  (max: number) =>
  (v: number) => {
    if (max >= 10_000_000) return `${Math.round(v / 1e6)}${NBSP}млн${NBSP}₽`;
    if (max >= 1_000_000) return `${(v / 1e6).toFixed(1)}${NBSP}млн${NBSP}₽`;
    return `${Math.round(v / 1e3)}${NBSP}тыс${NBSP}₽`;
  };

function Trend({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const positive = value >= 0;
  return (
    <Group gap={6} className={positive ? styles.trendUp : styles.trendDown} wrap="nowrap">
      <ThemeIcon size={size === 'lg' ? 28 : size === 'md' ? 24 : 20} radius="xl" variant="light" color={positive ? 'teal' : 'red'}>
        {positive ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
      </ThemeIcon>
      <Text fw={600}>{positive ? '+' : ''}{fmtRUB(value)}</Text>
    </Group>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card withBorder radius="lg" className={styles.card}>
      <Text size="sm" c="dimmed">{label}</Text>
      <Title order={3} className={styles.value}>{value}</Title>
      {sub && <Text size="xs" c="dimmed" className={styles.sub}>{sub}</Text>}
    </Card>
  );
}

function SectionTitle({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Group gap="xs" wrap="nowrap">
      {icon}
      <Title order={3}>{children}</Title>
    </Group>
  );
}

export default function SummaryPage() {
  const { balance, byAsset, today, invested, income, returns, deviations, movers } = MOCK;

  const assetRows = [
    { label: 'Облигации', value: byAsset.bonds, color: 'cyan' },
    { label: 'Фонды', value: byAsset.funds, color: 'violet' },
    { label: 'Акции', value: byAsset.stocks, color: 'grape' },
    { label: 'Деньги', value: byAsset.cash, color: 'teal' },
  ];
  const assetTotal = assetRows.reduce((s, r) => s + r.value, 0);

  const barsData = income.monthlyIncome.map((v, i) => ({ x: i + 1, Доход: v }));
  const donutData = assetRows.map((a) => ({ name: a.label, value: a.value, color: a.color as any }));
  const barsMax = Math.max(...income.monthlyIncome);

  return (
    <Stack gap="lg">
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="lg" p="lg" className={styles.card}>
            <Group justify="space-between" align="start" wrap="nowrap">
              <div>
                <Text size="sm" c="dimmed">Текущий баланс</Text>
                <Group align="baseline" gap="sm" wrap="wrap">
                  <Title order={1} title={fmtRUB(balance)} className={styles.balanceTitle}>
                    {fmtRUBWords(balance)}
                  </Title>
                  <Tooltip label="Дневной результат">
                    <div><Trend value={today.pnl} size="md" /></div>
                  </Tooltip>
                  <Badge size="lg" radius="sm" variant="light" color={today.pnl >= 0 ? 'teal' : 'red'}>
                    {fmtPct(today.pnlPct)}
                  </Badge>
                </Group>
              </div>
            </Group>

            <Divider my="md" />

            <Grid align="center">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <SimpleGrid cols={2} spacing="md">
                  {assetRows.map((r) => (
                    <Card key={r.label} withBorder radius="md" className={styles.assetCard}>
                      <Text size="sm" c="dimmed">{r.label}</Text>
                      <Group justify="space-between" mt={5} align="center" wrap="nowrap">
                        <Text fw={700} title={fmtRUB(r.value)} className={styles.value}>{fmtRUBWords(r.value)}</Text>
                        <Progress value={(r.value / assetTotal) * 100} className={styles.progress} aria-label={`${r.label} доля`} />
                      </Group>
                    </Card>
                  ))}
                </SimpleGrid>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 5 }}>
                <Card withBorder radius="lg" className={styles.card}>
                  <Text size="sm" c="dimmed" mb={6}>Инвестировано</Text>
                  <DonutChart
                    data={donutData}
                    withTooltip
                    tooltipDataSource="segment"
                    size={180}
                    thickness={26}
                    labelsType="value"
                    valueFormatter={(v) => fmtRUBWords(v as number)}
                    mx="auto"
                    chartLabel={fmtRUBWords(invested.investedNow)}
                  />
                </Card>
              </Grid.Col>
            </Grid>
          </Card>

          <Accordion radius="lg" multiple defaultValue={['invested', 'income', 'deviations']} className={styles.accordion}>
            <Accordion.Item value="today">
              <Accordion.Control>
                <SectionTitle icon={<ThemeIcon variant="light" color={today.pnl >= 0 ? 'teal' : 'red'} radius="md"><IconCash size={18} /></ThemeIcon>}>
                  Сегодня
                </SectionTitle>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid cols={2}>
                  <StatCard label="Итог" value={`${fmtRUBWords(today.pnl)} (${fmtPct(today.pnlPct)})`} />
                  <StatCard label="Акции" value={fmtRUBWords(today.breakdown.stocks)} />
                  <StatCard label="Облигации" value={fmtRUBWords(today.breakdown.bonds)} />
                  <StatCard label="Фонды" value={fmtRUBWords(today.breakdown.funds)} />
                </SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="invested">
              <Accordion.Control>
                <SectionTitle icon={<ThemeIcon variant="light" color="grape" radius="md"><IconCircleCheck size={18} /></ThemeIcon>}>
                  Инвестировано
                </SectionTitle>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                  <StatCard label="Инвестировано сейчас" value={fmtRUBWords(invested.investedNow)} />
                  <StatCard label="Введено" value={fmtRUBWords(invested.deposited)} />
                  <StatCard label="Выведено" value={fmtRUBWords(invested.withdrawn)} />
                  <StatCard label="В т.ч. в этом году" value={fmtRUBWords(invested.thisYear)} />
                  <StatCard label="Оборот" value={fmtRUBWords(invested.turnover)} />
                </SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="income">
              <Accordion.Control>
                <SectionTitle icon={<ThemeIcon variant="light" color="teal" radius="md"><IconTrendingUp size={18} /></ThemeIcon>}>
                  Доход
                </SectionTitle>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid cols={3}>
                  <StatCard label="Общий доход" value={fmtRUBWords(income.total)} sub={`в мес. ${fmtRUBWords(income.avgMonthly)}`} />
                  <StatCard label="Рост бумаг" value={fmtRUBWords(income.priceChange)} />
                  <StatCard label="Купоны и дивиденды" value={fmtRUBWords(income.couponsAndDivs)} />
                  <StatCard label="Комиссии" value={fmtRUBWords(income.fees)} />
                  <StatCard label="Налоги" value={fmtRUBWords(income.taxes)} />
                  <StatCard label="XIRR" value={fmtPct(returns.xirr)} />
                </SimpleGrid>

                <Grid mt="md">
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder radius="lg" className={styles.card}>
                      <Text fw={600} mb={8}>Купоны / Дивиденды</Text>
                      <Table withRowBorders={false} highlightOnHover>
                        <Table.Tbody>
                          <Table.Tr><Table.Td c="dimmed">Купоны</Table.Td><Table.Td ta="right" title={fmtRUB(income.coupons)} className={styles.value}>{fmtRUBWords(income.coupons)}</Table.Td></Table.Tr>
                          <Table.Tr><Table.Td c="dimmed">Дивиденды</Table.Td><Table.Td ta="right" title={fmtRUB(income.dividends)} className={styles.value}>{fmtRUBWords(income.dividends)}</Table.Td></Table.Tr>
                          <Table.Tr><Table.Td c="dimmed">На брок. счёт</Table.Td><Table.Td ta="right" title={fmtRUB(income.toBroker)} className={styles.value}>{fmtRUBWords(income.toBroker)}</Table.Td></Table.Tr>
                          <Table.Tr><Table.Td c="dimmed">На банк. счёт</Table.Td><Table.Td ta="right" title={fmtRUB(income.toBank)} className={styles.value}>{fmtRUBWords(income.toBank)}</Table.Td></Table.Tr>
                        </Table.Tbody>
                      </Table>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder radius="lg" className={styles.card}>
                      <Group justify="space-between" align="baseline" mb={6}>
                        <Text fw={600}>Доход по месяцам</Text>
                        <Badge variant="light">12 мес.</Badge>
                      </Group>
                      <BarChart
                        data={barsData}
                        dataKey="x"
                        series={[{ name: 'Доход' }]}
                        barProps={{ radius: 6 }}
                        withLegend={false}
                        gridAxis="none"
                        withXAxis={false}
                        yAxisProps={{ tickFormatter: makeAxisRubFormatter(barsMax) }}
                        valueFormatter={(v) => fmtRUB(v as number)}
                        withTooltip
                        h={140}
                      />
                    </Card>
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="deviations">
              <Accordion.Control>
                <SectionTitle icon={<ThemeIcon variant="light" color="orange" radius="md"><IconTrendingDown size={18} /></ThemeIcon>}>
                  Отклонения
                </SectionTitle>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid cols={2}>
                  <StatCard label={`Баланс в день макс. дохода`} value={fmtRUBWords(deviations.balanceAtMax)} />
                  <StatCard label="Текущее от максимума" value={`${fmtRUBWords(deviations.fromMaxAbs)} (${fmtPct(deviations.fromMaxPct)})`} />
                  <StatCard label={`Макс. просадка (${deviations.maxDrawdownDate})`} value={`${fmtRUBWords(deviations.maxDrawdownAbs)} (${fmtPct(deviations.maxDrawdownPct)})`} />
                  <StatCard label="Доход на дату макс. просадки" value={fmtRUBWords(deviations.incomeAtMaxDD)} />
                </SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <Card withBorder radius="lg" className={styles.sideCard}>
              <Text size="sm" c="dimmed">Коротко</Text>
              <Group justify="space-between" mt={6}><Text>Баланс</Text><Text fw={700} title={fmtRUB(balance)} className={styles.value}>{fmtRUBWords(balance)}</Text></Group>
              <Group justify="space-between" mt={4}><Text>Инвестировано</Text><Text fw={700} title={fmtRUB(invested.investedNow)} className={styles.value}>{fmtRUBWords(invested.investedNow)}</Text></Group>
              <Group justify="space-between" mt={4}>
                <Text>Доход</Text>
                <Group gap={8}><Text fw={700} title={fmtRUB(income.total)} className={styles.value}>{fmtRUBWords(income.total)}</Text><Badge variant="light" color="teal">XIRR {fmtPct(returns.xirr)}</Badge></Group>
              </Group>
              <Divider my="sm" />
              <Group justify="space-between" mt={4}><Text c="dimmed">Обновлено</Text><Text>{MOCK.updatedAt}</Text></Group>
              <Group justify="space-between" mt={4}><Text c="dimmed">Срок</Text><Text>{MOCK.horizon}</Text></Group>
            </Card>

            <Card withBorder radius="lg" className={styles.sideCard}>
              <Text size="sm" c="dimmed">Быстрые действия</Text>
              <Group mt="sm" gap="md" wrap="wrap">
                <Anchor href="#" underline="never">Экспорт CSV</Anchor>
                <Anchor href="#" underline="never">Добавить операцию</Anchor>
                <Anchor href="#" underline="never">Фильтры</Anchor>
              </Group>
            </Card>

            <Card withBorder radius="lg" className={styles.sideCard}>
              <Text size="sm" c="dimmed" mb={6}>Движение бумаг (день)</Text>
              <Stack gap={6}>
                {movers.map((m) => (
                  <Group key={m.name} justify="space-between">
                    <Text className={styles.value}>{m.name}</Text>
                    <Badge variant="light" color={m.change >= 0 ? 'teal' : 'red'}>
                      {m.change >= 0 ? '+' : ''}{fmtPct(m.change)}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </Card>

            <Card withBorder radius="lg" className={styles.sideCard}>
              <Text size="sm" c="dimmed" mb={6}>Деньги</Text>
              <Table withRowBorders={false} highlightOnHover>
                <Table.Tbody>
                  {MOCK.byAsset.cashDetail.map((r) => (
                    <Table.Tr key={r.currency}>
                      <Table.Td c="dimmed">{r.currency}</Table.Td>
                      <Table.Td ta="right" title={fmtRUB(r.amount)} className={styles.value}>{fmtRUBWords(r.amount)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
