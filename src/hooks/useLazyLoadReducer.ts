import { useEffect } from 'react';
import { useStore } from "react-redux";
import { lazyLoadReducer } from "../utils/lazyLoadReducer";

type UseLazyLoadReducerParams = {
  lazyLoadReducerName: string;
  featureReducer: any;
}

function useLazyLoadReducer({
  lazyLoadReducerName,
  featureReducer
}: UseLazyLoadReducerParams) {
  const store = useStore();

  useEffect(() => {
    lazyLoadReducer(store, lazyLoadReducerName, featureReducer);
  }, [featureReducer, lazyLoadReducerName, store]);
}

export default useLazyLoadReducer;
