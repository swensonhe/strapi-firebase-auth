/**
 *
 * Initializer
 *
 */

import { useEffect, useRef } from "react";
import pluginId from "../../pluginId";

type InitializerProps = {
  setPlugin: (id: string) => void;
};

export const Initializer = ({ setPlugin }: InitializerProps) => {
  const ref = useRef(setPlugin);

  useEffect(() => {
    ref.current(pluginId as string);
  }, []);

  return null;
};
