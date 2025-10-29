import { useMemo, useState } from 'react';
import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Group,
  ScrollArea,
  SegmentedControl,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSearch, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import styles from './PortfolioPage.module.scss';

export type Holding = {
  ticker: string;
  name: string;
  displayName: string;
  category: 'Облигации' | 'Валюта';
  qty: number;
  price: number;
  priceYday: number;
  amount: number;
  amountYday: number;
  sharePct: number;
  lastChg: number;
  lastChgPct: number;
  deltaDayPct: number;
  avgPrice: number;
  deltaFromAvg: number;
  deltaFromAvgPct: number;
  income: number;
  couponsDivs: number;
  incomeTotal: number;
  xirr: number;
  aar: number;
  nkd?: number;
  country?: string;
  matDate?: string;
  spark?: number[];
};

const ROWS: Holding[] = [
  {
    ticker: 'RUR', name: 'Рубль', displayName: 'Валюта', category: 'Валюта',
    qty: 1114595.98, price: 1, priceYday: 1, amount: 1114595.98, amountYday: 1114595.98,
    sharePct: 3.76, lastChg: 0, lastChgPct: 0, deltaDayPct: 0,
    avgPrice: 1, deltaFromAvg: 0, deltaFromAvgPct: 0,
    income: 0, couponsDivs: 0, incomeTotal: 0, xirr: 0, aar: 0, country: 'RU',
    spark: [1,1,1,1,1]
  },
  {
    ticker: 'SU29014RMFS6', name: 'ОФЗ 29014', displayName: 'ОФЗ-ПК 29014 25/03/26', category: 'Облигации',
    qty: 4284, price: 998, priceYday: 997.76, amount: 4344061.68, amountYday: 4341105.72,
    sharePct: 14.64, lastChg: 2955.96, lastChgPct: 0.07, deltaDayPct: 0.05,
    avgPrice: 1001.63, deltaFromAvg: -3.63, deltaFromAvgPct: -0.24,
    income: 53078.09, couponsDivs: 901469.08, incomeTotal: 1089249.17, xirr: 20.37, aar: 21.22,
    nkd: 16.02, country: 'RU', matDate: '2026-03-25', spark: [980, 990, 1002, 997, 998]
  },
  {
    ticker: 'SU29022RMFS9', name: 'ОФЗ 29022', displayName: 'ОФЗ-ПК 29022 20/07/33', category: 'Облигации',
    qty: 4254, price: 968.9, priceYday: 968, amount: 4121700.6, amountYday: 4300198.44,
    sharePct: 13.89, lastChg: -178497.84, lastChgPct: -4.15, deltaDayPct: -0.63,
    avgPrice: 1010.51, deltaFromAvg: -41.61, deltaFromAvgPct: -1.61,
    income: -177027.04, couponsDivs: 884052.98, incomeTotal: 839125.94, xirr: 16.17, aar: 16.71,
    nkd: 0, country: 'RU', matDate: '2033-07-20', spark: [980, 975, 970, 972, 969]
  },
  {
    ticker: 'SU29022RMFS4', name: 'ОФЗ 29022', displayName: 'ОФЗ-ПК 29022 20/07/33', category: 'Облигации',
    qty: 4254, price: 968.9, priceYday: 968, amount: 4121700.6, amountYday: 4300198.44,
    sharePct: 13.89, lastChg: -178497.84, lastChgPct: -4.15, deltaDayPct: -0.63,
    avgPrice: 1010.51, deltaFromAvg: -41.61, deltaFromAvgPct: -1.61,
    income: -177027.04, couponsDivs: 884052.98, incomeTotal: 839125.94, xirr: 16.17, aar: 16.71,
    nkd: 0, country: 'RU', matDate: '2033-07-20', spark: [980, 975, 970, 972, 969]
  },
  {
    ticker: 'SU29012RMFS9', name: 'ОФЗ 29022', displayName: 'ОФЗ-ПК 29022 20/07/33', category: 'Облигации',
    qty: 4254, price: 968.9, priceYday: 968, amount: 4121700.6, amountYday: 4300198.44,
    sharePct: 13.89, lastChg: -178497.84, lastChgPct: -4.15, deltaDayPct: -0.63,
    avgPrice: 1010.51, deltaFromAvg: -41.61, deltaFromAvgPct: -1.61,
    income: -177027.04, couponsDivs: 884052.98, incomeTotal: 839125.94, xirr: 16.17, aar: 16.71,
    nkd: 0, country: 'RU', matDate: '2033-07-20', spark: [980, 975, 970, 972, 969]
  },
  {
    ticker: 'SК29022RMFS9', name: 'ОФЗ 29022', displayName: 'ОФЗ-ПК 29022 20/07/33', category: 'Облигации',
    qty: 4254, price: 968.9, priceYday: 968, amount: 4121700.6, amountYday: 4300198.44,
    sharePct: 13.89, lastChg: -178497.84, lastChgPct: -4.15, deltaDayPct: -0.63,
    avgPrice: 1010.51, deltaFromAvg: -41.61, deltaFromAvgPct: -1.61,
    income: -177027.04, couponsDivs: 884052.98, incomeTotal: 839125.94, xirr: 16.17, aar: 16.71,
    nkd: 0, country: 'RU', matDate: '2033-07-20', spark: [980, 975, 970, 972, 969]
  },
];

const cur = (v: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 }).format(v);
const pct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

function Spark({ data, height = 44 }: { data: number[]; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / Math.max(1, (max - min))) * 100;
    return `${x},${y}`;
  }).join(' ');
  const last = data[data.length - 1] - data[data.length - 2];
  const color = last >= 0 ? 'var(--mantine-color-teal-5)' : 'var(--mantine-color-red-5)';
  return (
    <svg viewBox="0 0 100 100" className={styles.spark} style={{ height }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2" points={pts} />
      <polygon points={`${pts} 100,100 0,100`} fill="url(#grad)" />
    </svg>
  );
}

function HoldingSummary({ r }: { r: Holding }) {
  const up = r.lastChg >= 0;
  return (
    <Group gap="md" wrap="nowrap" className={styles.summary}>
      <span className={styles.flag} data-country={r.country} />
      <Box>
        <Group gap={8}>
          <Text fw={800}>{r.ticker}</Text>
          <Badge variant="light">{r.category}</Badge>
          {r.matDate && <Badge variant="dot" color="gray">{r.matDate}</Badge>}
        </Group>
        <Text size="sm" c="dimmed">{r.name} • {r.displayName}</Text>
      </Box>
      <Group gap={12} ml="auto" wrap="nowrap">
        <Chip checked={false} radius="sm" size="xs" variant="outline">Кол-во: <b>{new Intl.NumberFormat('ru-RU').format(r.qty)}</b></Chip>
        <Chip checked={false} radius="sm" size="xs" variant="outline">Сумма: <b>{cur(r.amount)}</b></Chip>
        <Chip checked={false} radius="sm" size="xs" variant="outline">Доля: <b>{r.sharePct.toFixed(2)}%</b></Chip>
        <Badge leftSection={up ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />} color={up ? 'teal' : 'red'} variant="light">
          {cur(r.lastChg)} ({pct(r.lastChgPct)})
        </Badge>
      </Group>
    </Group>
  );
}

function HoldingPanel({ r }: { r: Holding }) {
  const upAvg = r.deltaFromAvg >= 0;
  return (
    <Box className={styles.panel}>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        <Card withBorder radius="lg" shadow="sm" className={styles.tile}>
          <Text size="sm" c="dimmed">Текущая цена</Text>
          <Group justify="space-between" mt={4}>
            <Text fw={800}>{cur(r.price)}</Text>
            <Text size="sm" c="dimmed">вчера: {cur(r.priceYday)}</Text>
          </Group>
          {typeof r.nkd === 'number' && <Text size="xs" c="dimmed">НКД: {cur(r.nkd)}</Text>}
          <Spark data={r.spark || [r.price]} />
        </Card>

        <Card withBorder radius="lg" shadow="sm" className={styles.tile}>
          <Text size="sm" c="dimmed">Отклонение от средней</Text>
          <Group mt={6}>
            <Badge variant="light" color={upAvg ? 'teal' : 'red'}>{cur(r.deltaFromAvg)} ({pct(r.deltaFromAvgPct)})</Badge>
            <Text size="sm" c="dimmed">ср.: {cur(r.avgPrice)}</Text>
          </Group>
          <Divider my="xs" />
          <Text size="sm">Δ дня: <b>{pct(r.deltaDayPct)}</b></Text>
        </Card>

        <Card withBorder radius="lg" shadow="sm" className={styles.tile}>
          <Text size="sm" c="dimmed">Доходность</Text>
          <Group mt={6}>
            <Badge variant="light" color="teal">XIRR {pct(r.xirr)}</Badge>
            <Badge variant="light" color="grape">AAR {pct(r.aar)}</Badge>
          </Group>
          <Divider my="xs" />
          <Text size="sm">Доход по цене: <b>{cur(r.income)}</b></Text>
          <Text size="sm">Купоны/дивиденды: <b>{cur(r.couponsDivs)}</b></Text>
          <Text size="sm">Σ доход: <b>{cur(r.incomeTotal)}</b></Text>
        </Card>
      </SimpleGrid>
    </Box>
  );
}

export default function PortfolioPage() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<'Все' | 'Облигации' | 'Валюта'>('Все');
  const [sortKey, setSortKey] = useState<'amount' | 'lastChg' | 'sharePct'>('amount');

  const filtered = useMemo(() => {
    let list = [...ROWS];
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter(r => [r.ticker, r.name, r.displayName].some(x => x.toLowerCase().includes(s)));
    }
    if (category !== 'Все') list = list.filter(r => r.category === category);
    list.sort((a,b) => (b as any)[sortKey] - (a as any)[sortKey]);
    return list;
  }, [q, category, sortKey]);

  return (
      <Card withBorder radius="xl" p="md" shadow="md" className={styles.card}>
        <Group justify="space-between" align="center" className={styles.toolbar}>
          <Group wrap="nowrap">
            <TextInput placeholder="Поиск по тикеру/названию" leftSection={<IconSearch size={16} />} value={q} onChange={(e) => setQ(e.currentTarget.value)} w={320} />
            <SegmentedControl value={category} onChange={(v: any) => setCategory(v)} data={[ 'Все', 'Облигации', 'Валюта' ]} />
            <SegmentedControl value={sortKey} onChange={(v: any) => setSortKey(v)} data={[
              { label: 'По сумме', value: 'amount' },
              { label: 'По изменению', value: 'lastChg' },
              { label: 'По доле', value: 'sharePct' },
            ]} />
          </Group>
          <Group>
            <Button variant="subtle" size="xs" leftSection={<IconChevronDown size={16} />} onClick={() => {
              setTimeout(() => {
                const container = document.querySelector('[data-accordion-root]');
                container?.querySelectorAll('[data-accordion-control]').forEach((el: any) => el.getAttribute('data-active') || el.click());
              }, 0);
            }}>Развернуть всё</Button>
            <Button variant="subtle" size="xs" leftSection={<IconChevronUp size={16} />} onClick={() => {
              const container = document.querySelector('[data-accordion-root]');
              container?.querySelectorAll('[data-accordion-control][data-active="true"]').forEach((el: any) => el.click());
            }}>Свернуть всё</Button>
          </Group>
        </Group>

        <Divider my="sm" />

        <ScrollArea>
          <Accordion multiple chevronPosition="left" className={styles.accordion}>
            {filtered.map((r) => (
              <Accordion.Item key={r.ticker} value={r.ticker} className={styles.item}>
                <Accordion.Control>
                  <HoldingSummary r={r} />
                </Accordion.Control>
                <Accordion.Panel>
                  <HoldingPanel r={r} />
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </ScrollArea>
      </Card>
  );
}
