import React, { useEffect, useState } from "react";
import Xarrow, { xarrowPropsType } from "react-xarrows";
import {
  createSelectedItem,
  getRandomColor,
  getStringId,
  hasId,
  hasMatchingEndId,
  isObject,
} from "../helpers/helpersMatchColumns";
import { MatchList } from "./MatchList";
import { TitleColumn } from "./TitleColumn";

export interface IItem {
  id: string;
  index: number;
}

export interface IConnection {
  start: number | null; // campo que indica el INICIO de la conexion
  end: string | null; // campo que indica el FINAL de la conexion
  color: string | null; // campo que indica el COLOR de la conexion
}
interface ILeftList<LeftItemType> {
  list: LeftItemType[];
  renderItem: (item: LeftItemType, selectedItem?: LeftItemType) => React.ReactNode;
  title?: string;
}

interface IRightList<RightItemType> {
  list: RightItemType[];
  renderItem: (item: RightItemType, selectedDescription?: RightItemType) => React.ReactNode;
  title?: string;
}
interface IProps<LeftItemType, RightItemType> {
  leftSide: ILeftList<LeftItemType>;
  rightSide: IRightList<RightItemType>;
  showHeader?: boolean;
  // leftTitle?: string;
  // rightTitle?: string;
  titleProps?: React.HTMLAttributes<HTMLDivElement>;
  listProps?: React.HTMLAttributes<HTMLDivElement>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  onConnectionsChange?: (connections: { start: LeftItemType; end: RightItemType }[]) => void;
  connections?: IConnection[];
  xarrowProps?: xarrowPropsType;
}

export const MatchColumns = <LeftItemType, RightItemType>({
  leftSide,
  rightSide,
  // leftTitle = "Items",
  // rightTitle = "Descriptions",
  titleProps,
  showHeader,
  containerProps,
  listProps,
  connections: links = [],
  onConnectionsChange,
  xarrowProps,
}: IProps<LeftItemType, RightItemType>) => {
  const { list: itemList, renderItem: renderLeftItem, title: leftTitle } = leftSide;
  const { list: descriptionList, renderItem: renderRightItem, title: rightTitle } = rightSide;

  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<IItem | null>(null);
  const [connections, setConnections] = useState<IConnection[]>(links);

  const refs = React.useRef<React.RefObject<HTMLDivElement>[]>(itemList.map(() => React.createRef()));

  useEffect(() => {
    // filter connections to only keep connections that have a start and end value
    const filteredConnections = connections.filter(
      (connection) => connection.start !== null && connection.end !== null
    );

    // setConnections(filteredConnections);

    // remove any connections that have start and end values that are the same
    const uniqueConnections = Array.from(
      new Set(filteredConnections.map((connection) => JSON.stringify({ start: connection.start, end: connection.end })))
    ).map((connection) => JSON.parse(connection));

    console.log(uniqueConnections);

    const itemConnections = uniqueConnections.map((connection) => {
      return {
        start: itemList[connection.start as number] as never,
        end: descriptionList.find((description) => hasMatchingEndId(connection, description)) as never,
      };
    });

    if (onConnectionsChange) onConnectionsChange(itemConnections);

    // console.log("coonections =>", connections);
  }, [connections, onConnectionsChange, descriptionList, itemList]);

  // useEffect(() => {
  //   // setConnections(links);
  // }, [links]);

  function insertFirstItemConnection(index: number) {
    if (connections.length === 0) {
      const newConnections = [
        {
          start: index,
          end: null,
          color: getRandomColor(),
        },
      ];
      setConnections(newConnections);
    }
  }

  function insertFirstDescriptionConnection(currentDescription: IItem) {
    if (connections.length === 0) {
      const newConnections = [
        {
          start: null,
          end: currentDescription.id,
          color: getRandomColor(),
        },
      ];
      setConnections(newConnections);
    }
  }

  const handleSelectItem = (item: unknown, index: number) => {
    console.log("handleSelectItem =>", item, index);

    if (!isObject(item) && !hasId(item)) {
      return;
    }

    let newSelectedItem: IItem = createSelectedItem(item, index);

    setSelectedItem((prev) => {
      if (prev === item) {
        console.log("ani entra nulos");
        setConnections((prevConnections) => {
          return prevConnections.map((connection) => {
            if (connection.start === index) {
              return { ...connection, start: null };
            }
            return connection;
          });
        });
        return null;
      } else {
        let prevConnections = connections;

        // Si no hay ninguna conexión en la lista, insertar una
        insertFirstItemConnection(index);

        if (
          prevConnections.find((connection) => connection.end === selectedDescription?.id && connection.start !== index)
        ) {
          console.log("ani entro 1");

          const oldConnection = prevConnections.find(
            (connection) => connection.start === index && connection.end !== null
          );

          console.log("oldConnection =>", oldConnection);

          const newConnections = prevConnections.map((connection) => {
            if (connection.end === selectedDescription?.id && connection.start !== index) {
              // setSelectedAnimal(null);
              newSelectedItem = null;
              setSelectedDescription(null);
              return { ...connection, start: index };
            }
            return connection;
          });

          if (oldConnection) {
            const indexOldConnection = newConnections.indexOf(oldConnection);
            newConnections.splice(indexOldConnection, 1);
          }

          prevConnections = newConnections;
        } else if (prevConnections.find((connection) => connection.start === index && connection.end === null)) {
          console.log("ani entro 2");
          prevConnections = prevConnections.map((connection) => {
            if (connection.start === index) {
              return { ...connection, start: index };
            }
            return connection;
          });
        } else if (
          !selectedDescription &&
          selectedItem &&
          prevConnections.find((connection) => connection.start === index && connection.end !== null) &&
          prevConnections.find((connection) => connection.start === selectedItem.index && connection.end !== null)
        ) {
          // Elimina una conexión existente y la reemplaza por la nueva
          console.log("ani entro 3");

          const oldConnection = prevConnections.find(
            (connection) => connection.start === index && connection.end !== null
          );
          const newConnections = prevConnections.map((connection) => {
            if (connection.start === selectedItem.index) {
              // setSelectedAnimal(null);
              newSelectedItem = null;
              return { ...connection, start: index };
            }
            return connection;
          });

          if (oldConnection) {
            const indexOldConnection = newConnections.indexOf(oldConnection!);
            newConnections.splice(indexOldConnection, 1);
          }

          prevConnections = newConnections;
        } else if (!selectedDescription && selectedItem) {
          console.log("ani entro 4");
          prevConnections = prevConnections.map((connection) => {
            if (connection.start === selectedItem.index && connection.start === index) {
              console.log("ani entra 4.1");
              // setSelectedAnimal(null);
              newSelectedItem = null;
              return { ...connection, start: index };
            } else if (
              connection.start === selectedItem.index &&
              connection.start !== index &&
              connection.end !== null
            ) {
              console.log("ani entra 4.2");
              newSelectedItem = null;
              return { ...connection, start: index };
            } else if (connection.start !== index && connection.end === null) {
              console.log("ani entra 4.3");
              return { ...connection, start: index };
            }
            console.log("ani entra 4.4");
            return connection;
          });
        } else if (prevConnections.find((connection) => connection.start === index)) {
          // Evitar nuevas conexiones entre el mismo enlace
          console.log("ani entro 5");
          if (selectedDescription) {
            newSelectedItem = null;
            setSelectedDescription(null);
          }
        } else {
          console.log("ani agrega nuevo elemento");
          prevConnections = [
            ...prevConnections,
            {
              start: index,
              end: null,
              color: getRandomColor(),
            },
          ];
        }

        setConnections(prevConnections);

        return newSelectedItem;
      }
    });
  };

  const handleSelectDescription = (description: unknown, index: number) => {
    console.log("handleSelectDescription =>", description, index);

    if (!isObject(description) && !hasId(description)) {
      return;
    }

    // if (!selectedItem) return;

    setSelectedDescription((prevSelectedDescription) => {
      let currentDescription: IItem = createSelectedItem(description, index);

      if (prevSelectedDescription === description) {
        console.log("desc entra nulos");
        setConnections((prevConnections) => {
          return prevConnections.map((connection) => {
            if (hasMatchingEndId(connection, description)) {
              return { ...connection, end: null };
            }
            return connection;
          });
        });
        return null;
      } else {
        // console.log("se vuelve a ejecutar desc");
        // setSelectedDescription({ ...description, index });

        let prevConnections = connections;

        // Si no hay ninguna conexión en la lista, insertar una
        insertFirstDescriptionConnection(currentDescription);

        // Ecenario 1: Crear una nueva conexion entre 2 elementos libres
        // Cierra una conexion abierta. Busca una conexion abierta con el ITEM seleccionado en la lista de conexiones,
        // y dicha conexion debe estar libre en el FINAL de la conexion
        if (
          prevConnections.find(
            (connection) => connection.start === selectedItem?.index && !hasMatchingEndId(connection, description)
          )
        ) {
          console.log("desc entro 1");
          console.log("currentDescription", currentDescription);

          const oldConnection = prevConnections.find(
            (connection) => hasMatchingEndId(connection, description) && connection.start !== null
          );

          const newConnections = prevConnections.map((connection) => {
            if (connection.start === selectedItem?.index && !hasMatchingEndId(connection, description)) {
              setSelectedItem(null);
              currentDescription = null;
              return { ...connection, end: getStringId(description) };
            }
            return connection;
          });

          if (oldConnection) {
            const indexOldConnection = newConnections.indexOf(oldConnection!);
            newConnections.splice(indexOldConnection, 1);
          }

          prevConnections = newConnections;
        } else if (
          prevConnections.find((connection) => hasMatchingEndId(connection, description) && connection.start === null)
        ) {
          console.log("desc entro 2");
          prevConnections = prevConnections.map((connection) => {
            if (hasMatchingEndId(connection, description)) {
              return { ...connection, end: getStringId(description) };
            }
            return connection;
          });
        } else if (
          !selectedItem &&
          selectedDescription &&
          prevConnections.find(
            (connection) => hasMatchingEndId(connection, description) && connection.start !== null
          ) &&
          prevConnections.find((connection) => connection.end === selectedDescription.id && connection.start !== null)
        ) {
          // Elimina una conexión existente y la reemplaza por la nueva
          console.log("desc entro 3");

          const oldConnection = prevConnections.find(
            (connection) => hasMatchingEndId(connection, description) && connection.start !== null
          );
          const newConnections = prevConnections.map((connection) => {
            if (connection.end === selectedDescription.id) {
              // setSelectedDescription(null);
              currentDescription = null;
              return { ...connection, end: getStringId(description) };
            }
            return connection;
          });

          if (oldConnection) {
            const indexOldConnection = newConnections.indexOf(oldConnection!);
            newConnections.splice(indexOldConnection, 1);
          }

          prevConnections = newConnections;
        } else if (!selectedItem && selectedDescription) {
          console.log("desc entro 4");
          prevConnections = prevConnections.map((connection) => {
            if (connection.end === selectedDescription.id && hasMatchingEndId(connection, description)) {
              console.log("desc entra 4.1");
              currentDescription = null;
              return { ...connection, end: getStringId(description) };
            } else if (
              connection.end === selectedDescription.id &&
              !hasMatchingEndId(connection, description) &&
              connection.start !== null
            ) {
              console.log("desc entra 4.2");
              currentDescription = null;
              return { ...connection, end: getStringId(description) };
            } else if (!hasMatchingEndId(connection, description) && connection.start === null) {
              console.log("desc entra 4.3");
              return { ...connection, end: getStringId(description) };
            }
            console.log("desc entra 4.4");
            return connection;
          });
        } else if (prevConnections.find((connection) => hasMatchingEndId(connection, description))) {
          // Evitar nuevas conexiones entre el mismo enlace
          console.log("desc entra 5");
          if (selectedItem) {
            currentDescription = null;
            setSelectedItem(null);
          }
          // return prevConnections;
        } else {
          console.log("desc agrega nuevo elemento");
          prevConnections = [
            ...prevConnections,
            {
              start: null,
              end: currentDescription.id,
              color: getRandomColor(),
            },
          ];
        }

        setConnections(prevConnections);

        // return { ...description, index };
        return currentDescription;
      }
    });
  };

  return (
    <div
      className={`flex justify-center items-center max-sm:w-screen max-md:w-10/12 md:w-9/12 xl:w-1/2  ${containerProps?.className}`}
    >
      <div
        {...containerProps}
        className={`grid grid-cols-[repeat(3,minmax(100px,1fr))] gap-2 p-5 border place-content-center rounded-xl shadow-lg w-full `}
      >
        {showHeader ? <TitleColumn {...titleProps}>{leftTitle}</TitleColumn> : <div></div>}
        <div className="relative"></div>
        {showHeader ? <TitleColumn {...titleProps}>{rightTitle}</TitleColumn> : <div></div>}

        {/* ANIMALS */}
        <MatchList {...listProps}>
          {itemList.map((item: unknown, index) => {
            if (isObject(item) && hasId(item)) {
              const id = getStringId(item);
              return (
                <div
                  key={id}
                  id={`animal-${id}`}
                  ref={refs.current[index]}
                  onClick={() => handleSelectItem(item, index)}
                >
                  {renderLeftItem(item as never, selectedItem as never)}
                </div>
              );
            }
          })}
        </MatchList>
        <div className="relative"></div>

        {/* DESCRIPTIONS */}
        <MatchList {...listProps}>
          {descriptionList.map((item: unknown, index) => {
            if (isObject(item) && hasId(item)) {
              const id = getStringId(item);
              return (
                <div key={index} id={id.toString()} onClick={() => handleSelectDescription(item, index)}>
                  {renderRightItem(item as never, selectedDescription as never)}
                </div>
              );
            }
          })}
        </MatchList>
      </div>

      {/* Renderizar las conexiones */}
      {connections.map((connection, index) => {
        return (
          connection.end !== null &&
          connection.start !== null && (
            <Xarrow
              key={index}
              start={refs.current[connection.start]}
              end={connection.end}
              headShape={"circle"}
              headSize={3}
              showTail
              tailShape={"circle"}
              tailSize={3}
              color={connection.color}
              path="smooth"
              // lineColor={connection.color}
              strokeWidth={3}
              // tailColor={connection.color}
              // headColor={connection.color}
              startAnchor={{ position: "auto", offset: { x: 5, y: 0 } }}
              endAnchor={{ position: "auto", offset: { x: -5, y: 0 } }}
              {...xarrowProps}
            />
          )
        );
      })}
    </div>
  );
};
