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
  titleProps,
  showHeader,
  containerProps,
  listProps,
  connections: links = [],
  onConnectionsChange,
  xarrowProps,
}: IProps<LeftItemType, RightItemType>) => {
  const { list: itemList, renderItem: renderLeftItem, title: leftTitle = "Items" } = leftSide;
  const { list: descriptionList, renderItem: renderRightItem, title: rightTitle = "Descriptions" } = rightSide;

  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<IItem | null>(null);
  const [connections, setConnections] = useState<IConnection[]>(links);
  const [connection, setConnection] = useState<IConnection>(null);

  const refs = React.useRef<React.RefObject<HTMLDivElement>[]>(itemList.map(() => React.createRef()));

  const handleSelectItem = (item: unknown, index: number) => {
    if (!isObject(item) && !hasId(item)) {
      return;
    }

    const newSelectedItem: IItem = createSelectedItem(item, index);

    setSelectedItem(newSelectedItem);
  };

  const handleSelectDescription = (description: unknown, index: number) => {
    if (!isObject(description) && !hasId(description)) {
      return;
    }

    const newSelectedDescription: IItem = createSelectedItem(description, index);

    setSelectedDescription(newSelectedDescription);
  };

  // Efecto para la creacion de una nueva conexion cuando se haya seleccionado un item y una descripción
  useEffect(() => {
    if (selectedItem && selectedDescription) {
      const newConnection: IConnection = {
        start: selectedItem.index,
        end: selectedDescription.id,
        color: getRandomColor(),
      };
      setConnection(newConnection);
      setSelectedDescription(null);
      setSelectedItem(null);
    }
  }, [selectedItem, selectedDescription]);

  // Efecto para remover las conexiones relacionadas con la nueva conexion
  useEffect(() => {
    if (connection) {
      setConnections((prevConnections) => {
        const filteredConnections = prevConnections.filter(
          (prevConnection) => prevConnection.start !== connection.start && prevConnection.end !== connection.end
        );

        const newConnections = [...filteredConnections, connection];
        return newConnections;
      });
      setConnection(null);
    }
  }, [connection]);

  // Efecto pra asesgurarse de que todas las conexiones tengan un color
  useEffect(() => {
    const connection = connections.find((connection) => !connection.color);
    if (connection) {
      const index = connections.indexOf(connection);
      const newConnections = [...connections];
      newConnections[index].color = getRandomColor();
      setConnections(newConnections);
    }
  }, [connections]);

  // Efecto para devolver las conexiones creadas al componente padre, devolvemos un array de objetos
  // con el formato { start: LeftItemType, end: RightItemType }
  useEffect(() => {
    if (onConnectionsChange) {
      const newConnections: {
        start: LeftItemType;
        end: RightItemType;
      }[] = connections.map((connection) => ({
        start: itemList[connection.start],
        end: descriptionList.find((description) => hasMatchingEndId(connection, description)),
      }));
      onConnectionsChange(newConnections);
    }
  }, [connections, onConnectionsChange, descriptionList, itemList]);

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
              headSize={4}
              showTail
              tailShape={"circle"}
              tailSize={4}
              color={connection.color}
              path="smooth"
              strokeWidth={3}
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
