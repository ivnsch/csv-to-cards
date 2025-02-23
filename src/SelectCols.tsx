import "./App.css";
import { useStore } from "./store";

function SelectCols() {
  const filters = useStore((state) => state.filters);
  const toggleFilter = useStore((state) => state.toggleFilter);

  return <div>todo</div>;
}

export default SelectCols;
