import React, { useEffect, useRef, useState } from "react";
import Xarrow, { xarrowPropsType } from "react-xarrows";
import {
  createItem,
  getRandomColor,
  getStringId,
  hasId,
  hasMatchingEndId,
  isObject,
} from "../helpers/helpersMatchColumns";
import { MatchList } from "./MatchList";
import { TitleColumn } from "./TitleColumn";
import { signal } from "@preact/signals";

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
  onConnectionsChange: (connections: { start: LeftItemType; end: RightItemType }[]) => void;
  connections?: IConnection[];
  xarrowProps?: xarrowPropsType;
}

const connections = signal<IConnection[]>([]);
const selectedItem = signal<IItem | null>(null);
const selectedDescription = signal<IItem | null>(null);

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

  useEffect(() => {
    connections.value = links;
  }, [links]);

  onConnectionsChange(
    connections.value.map(({ start, end }) => ({
      start: itemList[start],
      end: descriptionList.find((description) => getStringId(description) === end),
    }))
  );

  const refs = React.useRef<React.RefObject<HTMLDivElement>[]>(itemList.map(() => React.createRef()));

  const handleSelectItem = (item: unknown, index: number) => {
    if (!isObject(item) && !hasId(item)) {
      return;
    }
    const currentItem: IItem = createItem(item, index);
    selectedItem.value = currentItem;
  };

  const handleSelectDescription = (description: unknown, index: number) => {
    if (!isObject(description) && !hasId(description)) {
      return;
    }
    const currentDescription: IItem = createItem(description, index);
    selectedDescription.value = currentDescription;
  };

  if (selectedItem.value && selectedDescription.value) {
    const item: IConnection = {
      start: selectedItem.value.index,
      end: selectedDescription.value.id,
      color: getRandomColor(),
    };

    const filteredConnections = connections.value.filter(
      (connection) => connection.end !== item.end && connection.start !== item.start
    );

    connections.value = [...filteredConnections, item];
    selectedItem.value = null;
    selectedDescription.value = null;
  }

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
                <div key={id} ref={refs.current[index]} onClick={() => handleSelectItem(item, index)}>
                  {renderLeftItem(item as never, selectedItem.value as never)}
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
                  {renderRightItem(item as never, selectedDescription.value as never)}
                </div>
              );
            }
          })}
        </MatchList>
      </div>

      {/* Renderizar las conexiones */}
      {connections.value.map((connection, index) => {
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
              path="smooth"
              strokeWidth={3}
              color={connection.color}
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
