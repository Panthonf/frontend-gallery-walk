import { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Modal,
  Pagination, // 1. Import Pagination component
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import classes from "./TableSort.module.css";
import moment from "moment";

interface RowData {
  created_at: string;
  total_virtual_money: number;
  description: string;
  id: number;
  title: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      keys(data[0]).some((key) => {
        const value = item[key];
        if (typeof value === "string") {
          return value.toLowerCase().includes(query);
        } else if (typeof value === "number") {
          // Convert number to string before comparison
          return String(value).toLowerCase().includes(query);
        }
        return false;
      })
    );
  }

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const valueA = String(a[sortBy]);
      const valueB = String(b[sortBy]);

      if (payload.reversed) {
        return valueB.localeCompare(valueA);
      }

      return valueA.localeCompare(valueB);
    }),
    payload.search
  );
}

export function TableSort(props: { data: RowData[] }) {
  console.log("props", props.data);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(props.data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    setSortedData(props.data);
  }, [props.data]);

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(props.data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(props.data, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const [rowOpened, setRowOpened] = useState<boolean[]>(
    Array(props.data.length).fill(false)
  );

  const handleRowClick = (index: number) => {
    const updatedRowOpened = [...rowOpened];
    updatedRowOpened[index] = true;
    setRowOpened(updatedRowOpened);
  };

  const handleModalClose = (index: number) => {
    const updatedRowOpened = [...rowOpened];
    updatedRowOpened[index] = false;
    setRowOpened(updatedRowOpened);
  };

  
  const getPaginatedData = () => {
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };

  const rows = getPaginatedData().map((row, index) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>
        <Modal
          opened={rowOpened[index]}
          onClose={() => handleModalClose(index)}
          title={row.title}
        >
          <div dangerouslySetInnerHTML={{ __html: row.description }} />
        </Modal>
        <Text lineClamp={1} onClick={() => handleRowClick(index)}>
          <div dangerouslySetInnerHTML={{ __html: row.description }} />
        </Text>
      </Table.Td>{" "}
      <Table.Td>{row.total_virtual_money}</Table.Td>
      <Table.Td>{moment(row.created_at).format("MMMM DD, YYYY")}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mt="60"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === "title"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("title")}
            >
              <Text c="red" fw={1000}>Title</Text>
            </Th>
            <Th
              sorted={sortBy === "description"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("description")}
            >
              <Text c="red" fw={1000}>Description</Text>
            </Th>
            <Th
              sorted={sortBy === "total_virtual_money"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("total_virtual_money")}
            >
              <Text c="red" fw={1000}>Total Virtual Money</Text>
            </Th>
            <Th
              sorted={sortBy === "created_at"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("created_at")}
            >
              <Text c="red" fw={1000}>Created At</Text>
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Center py="xl">
                  <Text c="graycolor.3">No data found</Text>
                </Center>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      {/* 4. Update Pagination props */}
      <Center mt="md">
        <Pagination
          color="redcolor.4"
          total={Math.ceil(sortedData.length / itemsPerPage)} // Total pages
          value={activePage}
          onChange={setActivePage} // Change 'setPage' to 'setActivePage'
          mt="sm"
        />
      </Center>
    </ScrollArea>
  );
}
