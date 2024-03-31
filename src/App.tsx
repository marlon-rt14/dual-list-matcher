import { MatchColumns } from "./components/MatchColumns";
import { MatchItem } from "./components/MatchItem";
import { getRandomColor } from "./helpers/helpersMatchColumns";

interface Animal {
  id: string;
  name: string;
}

interface Description {
  id: string;
  description: string;
}

const ANIMALS: Animal[] = [
  { id: "5", name: "Hippo" },
  { id: "7", name: "Cat" },
  { id: "1", name: "Tiger" },
  { id: "3", name: "Elephant" },
  { id: "6", name: "Dog" },
  { id: "4", name: "Snake" },
  { id: "2", name: "Lion" },
];

const DESCRIPTIONS: Description[] = [
  { id: "3", description: "Elephant" },
  { id: "5", description: "Hippo" },
  { id: "7", description: "Cat" },
  { id: "4", description: "Snake" },
  { id: "2", description: "Lion" },
  { id: "1", description: "Tiger" },
  { id: "6", description: "Dog" },
];

const renderAnimalItem = (item: Animal, selected: Animal | null) => {
  return <MatchItem className={` ${selected?.id === item.id ? "bg-orange-100" : ""}`}>{item.name}</MatchItem>;
};

const renderDescriptionItem = (item: Description, selected: Description | null) => {
  return <MatchItem className={`${selected?.id === item.id ? "bg-orange-100" : ""}`}>{item.description}</MatchItem>;
};

function App() {
  return (
    <div className="h-screen flex justify-center items-center">
      <MatchColumns
        showHeader
        leftSide={{
          list: ANIMALS,
          renderItem: renderAnimalItem,
          title: "Animals",
        }}
        rightSide={{
          list: DESCRIPTIONS,
          renderItem: renderDescriptionItem,
          title: "Descriptions",
        }}
        onConnectionsChange={(connections) => console.log('connections', connections)}
        connections={[{ color: getRandomColor(), start: 1, end: "2" }]}
      />
    </div>
  );
}

export default App;
