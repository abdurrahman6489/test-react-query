import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryKey,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { addPost, fetchData } from "./api";

interface Product {
  title: string;
  /* Add other properties as needed */
}
interface DataType {
  products: Product[];
}
const Example = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [limit, setLimit] = useState(10);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
    setTitle("");
  };

  const { data, isPending, isError, error, isLoading, refetch, isSuccess } =
    useQuery<{
      products: Product[];
    }>({
      queryKey: ["products", { search, limit }],
      initialData: { products: [] },

      queryFn: () => fetchData(search, limit),
      refetchInterval: 60 * 1000,
    });

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     // Trigger a manual refetch at the specified interval
  //     refetch();
  //   }, 60000);

  //   return () => {
  //     clearInterval(intervalId); // Clear the interval when the component unmounts
  //   };
  // }, [refetch]);

  useEffect(() => {
    const previousData = queryClient.getQueryData([
      "products",
      { search, limit },
    ]);
    const isDataChanged = JSON.stringify(data) !== JSON.stringify(previousData);
    console.log({ isDataChanged });
    if (isDataChanged)
      queryClient.setQueryData(["products", { search, limit }], data);
  }, [data, queryClient]);

  const mutation = useMutation({
    mutationKey: ["addPost", { title }],
    mutationFn: () => addPost(title),
    onSuccess: () =>
      queryClient.invalidateQueries([
        "products",
        { search, limit },
      ] as InvalidateQueryFilters),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong, {error.message}</div>;
  return (
    <div>
      <input
        value={search}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(event.target.value)
        }
      />
      <button onClick={() => setLimit((prev) => prev + 5)}>Increase</button>
      <button
        onClick={() => setLimit((prev) => (prev >= 10 ? prev - 5 : prev))}
      >
        Decrease
      </button>
      <p>Total Products : {data?.products?.length || 0}</p>
      {data?.products?.map((product) => (
        <p>{product.title}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(event.target.value)
          }
        />
      </form>
    </div>
  );
};

export default Example;
