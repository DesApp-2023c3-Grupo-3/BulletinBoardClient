import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
} from '@nextui-org/react';
import useSearchTerm from '../../hooks/useSearchTermAdvertising';
import { useTabla } from '../../hooks/useTable';
import useDebounce from '../../hooks/useDebounce';
import { advertisingsAPI } from '../../../../services/advertisings';
import { userApi } from '../../../../services/users';
import { commissionApi } from '../../../../services/commissions';

interface TablaNextUiProps {
  datasJSON: any[];
  columns: Map<string, (data: any) => void>;
  onRowClick?: (data: any) => void;
  placeholder?: string;
  type: number;
  setDatasJSON: Dispatch<SetStateAction<any[]>>;
}

function TablaNextUi({
  datasJSON,
  columns,
  onRowClick,
  placeholder,
  type,
  setDatasJSON,
}: TablaNextUiProps) {
  const {
    currentPages,
    currentPagesC,
    currentPagesU,
    setCurrentPageC,
    setCurrentPageU,
    totalItems,
    pages,
    setRowsPerPage,
    rowsPerPage,
    rowsPerPageC,
    rowsPerPageU,
    setRowsPerPageC,
    setCurrentPage,
    setTotalItems,
    setPages,
    setRowsPerPageU,
  } = useTabla();

  const columnsArray = Array.from(columns, ([key, handler]) => ({
    key,
    handler,
  }));

  const handleRowClick = (item: any) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPageType(type, page);
  }, []);

  const currentPageType = (type: number) => {
    switch (type) {
      case 1:
        return currentPages;
      case 2:
        return currentPagesC;
      case 3:
        return currentPagesU;
    }
  };

  const setCurrentPageType = (type: number, page: number) => {
    switch (type) {
      case 1:
        setCurrentPage(page);
        break;
      case 2:
        setCurrentPageC(page);
        break;
      case 3:
        setCurrentPageU(page);
        break;
    }
  };

  const bottomContent = React.useMemo(() => {
    return (
      <Pagination
        classNames={{
          base: 'overflow-hidden',
        }}
        color="primary"
        className="scrollbar-none flex justify-center w-full mt-[20px]"
        showControls
        total={pages}
        page={currentPageType(type)}
        onChange={handlePageChange}
        variant="light"
      ></Pagination>
    );
  }, [pages, currentPagesC, currentPagesU, currentPages]);

  const { searchTerm, setSearchTerm } = useSearchTerm();

  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setCurrentPageType(type, 1);
    },
    [],
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (type === 1) {
        setRowsPerPage(Number(e.target.value));
      } else if (type === 2) {
        setRowsPerPageC(Number(e.target.value));
      } else {
        setRowsPerPageU(Number(e.target.value));
      }
      setCurrentPageType(type, 1);
    },
    [setRowsPerPage, setCurrentPage, setRowsPerPageC, setRowsPerPageU],
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-end">
          <Input
            isClearable
            className={'w-[300px] sm:max-w-[44%]'}
            placeholder={placeholder}
            size="sm"
            startContent={lupa}
            value={searchTerm}
            variant="bordered"
            onChange={onSearchChange}
            onClear={() => setSearchTerm('')}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {type === 1 ? 'Avisos' : type === 2 ? 'Comisiones' : 'Usuarios'}{' '}
            totales: {totalItems}{' '}
          </span>
        </div>
      </div>
    );
  }, [
    onSearchChange,
    onRowsPerPageChange,
    searchTerm,
    rowsPerPage,
    totalItems,
    placeholder,
  ]);

  const getAdvertising = () => {
    adjustItemsPerPage();
    advertisingsAPI
      .getPaginated(currentPages, rowsPerPage, searchTerm)
      .then((r) => {
        setDatasJSON(r.data.data);
        setTotalItems(r.data.total);
        setPages(r.data.totalPages);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getUser = () => {
    adjustItemsPerPage();
    userApi
      .getPaginated(currentPagesU, rowsPerPageU, searchTerm)
      .then((r) => {
        setDatasJSON(r.data.data);
        setTotalItems(r.data.total);
        setPages(r.data.totalPages);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getCommision = () => {
    adjustItemsPerPage();
    commissionApi
      .getPaginated(currentPagesC, rowsPerPageC, searchTerm)
      .then((r) => {
        setDatasJSON(r.data.data);
        setTotalItems(r.data.total);
        setPages(r.data.totalPages);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [firstRender, setFirstRender] = React.useState(true);
  const adjustItemsPerPage = () => {
    const rowA = 70;
    const row = 40;

    const windowHeight = window.innerHeight - 450;
    const maxRowsToShow = Math.floor(windowHeight / (type === 1 ? rowA : row));
    if (maxRowsToShow <= 0) {
      typeSetRowsPerPage(type, 1);
    } else {
      typeSetRowsPerPage(type, maxRowsToShow);
    }
  };

  useEffect(() => {
    adjustItemsPerPage();
    if (firstRender) {
      setFirstRender(false);
    } else {
      switch (type) {
        case 1:
          adjustItemsPerPage();
          getAdvertising();
          break;
        case 2:
          adjustItemsPerPage();
          getCommision();
          break;
        case 3:
          adjustItemsPerPage();
          getUser();
          break;
      }
    }

    window.addEventListener('resize', adjustItemsPerPage);

    return () => {
      window.removeEventListener('resize', adjustItemsPerPage);
    };
  }, [
    currentPages,
    currentPagesC,
    currentPagesU,
    rowsPerPage,
    setDatasJSON,
    debouncedSearchTerm,
    rowsPerPageU,
    rowsPerPageC,
    setRowsPerPage,
    setRowsPerPageC,
    setRowsPerPageU,
  ]);

  const typeSetRowsPerPage = (type: number, rows: number) => {
    switch (type) {
      case 1:
        setRowsPerPage(rows);
        break;
      case 2:
        setRowsPerPageC(rows);
        break;
      case 3:
        setRowsPerPageU(rows);
        break;
    }
  };

  return (
    <div>
      <Table
        className="mb-[20px]"
        aria-labelledby="Tabla"
        isStriped
        selectionMode="single"
        layout="fixed"
        isCompact
        bottomContent={bottomContent}
        topContent={topContent}
        onRowAction={(row) => {
          handleRowClick(datasJSON[parseInt(row.toLocaleString())]);
        }}
        classNames={{
          tr: `${type === 1 ? 'h-[50px]' : 'h-[40px]'} `,
          wrapper: `h-[calc(100vh-250px)] overflow-hidden`,
          base: 'overflow-hidden',
        }}
      >
        <TableHeader columns={columnsArray}>
          {(column) => <TableColumn key={column.key}>{column.key}</TableColumn>}
        </TableHeader>
        <TableBody>
          {datasJSON.map((data, index) => (
            <TableRow key={index}>
              {columnsArray.map((columnName) => {
                return (
                  <TableCell key={columnName.key} itemRef="ref">
                    {columns.get(columnName.key)?.call(data, data) || '-'}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default React.memo(TablaNextUi);

const lupa = (
  <svg
    width="29"
    height="31"
    viewBox="0 0 29 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.6833 27.125L16.0708 18.9875C15.4667 19.5042 14.7719 19.9132 13.9865 20.2146C13.201 20.516 12.3653 20.6667 11.4792 20.6667C9.28403 20.6667 7.42642 19.8538 5.90633 18.228C4.38625 16.6022 3.62581 14.6165 3.625 12.2708C3.625 9.92431 4.38544 7.93858 5.90633 6.31367C7.42722 4.68875 9.28483 3.87586 11.4792 3.875C13.6743 3.875 15.5319 4.68789 17.052 6.31367C18.5721 7.93944 19.3325 9.92517 19.3333 12.2708C19.3333 13.2181 19.1924 14.1115 18.9104 14.951C18.6285 15.7906 18.2458 16.5333 17.7625 17.1792L25.375 25.3167L23.6833 27.125ZM11.4792 18.0833C12.9896 18.0833 14.2736 17.518 15.3313 16.3874C16.389 15.2567 16.9175 13.8846 16.9167 12.2708C16.9167 10.6562 16.3878 9.28364 15.3301 8.153C14.2724 7.02236 12.9888 6.45747 11.4792 6.45833C9.96875 6.45833 8.68469 7.02365 7.627 8.15429C6.56931 9.28493 6.04086 10.6571 6.04167 12.2708C6.04167 13.8854 6.57051 15.258 7.62821 16.3887C8.6859 17.5193 9.96956 18.0842 11.4792 18.0833Z"
      fill="#484848"
    />
  </svg>
);
