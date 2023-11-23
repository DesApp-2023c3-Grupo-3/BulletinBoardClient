import TableRow from './TableRow';

interface TableBodyProps {
  dataJSON: any[];
  columns: Map<string, (data: any) => void>;
  onRowClick?: (data: any) => void;
}

function TableBody({ dataJSON, columns, onRowClick }: TableBodyProps) {
  return (
    <div>
      <table className="table-auto border-collapse overflow-hidden rounded-tl-[20px] rounded-tr-[20px] mt-10 font-[500]">
        <thead className="bg-[#484848] text-[#BABABA] text-[1.5em] text-left">
          <tr>
            {Array.from(columns.keys()).map((columnName) => {
              return (
                <th
                  key={columnName}
                  className={`px-6 py-4 
                  ${
                    columnName === ''
                      ? 'w-[3em] flex justify-center'
                      : 'w-[24em] px-4 py-4 '
                  } 
                  ${columnName === 'Estado' ? 'w-[16px] ' : ''}
                  `}
                >
                  {columnName}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="text-[20px] font[500]">
          {dataJSON.map((data, index) => (
            <TableRow
              key={data.id}
              item={data}
              index={index}
              columns={columns}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableBody;
