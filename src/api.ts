export const fetchData = async (search = "", limit = 10) => {
    const url = search
      ? `https://dummyjson.com/products/search?q=${search}`
      : `https://dummyjson.com/products?limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

export const addPost = async (title: string) => {
    const response = await fetch("https://dummyjson.com/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        /* other product data */
      }),
    });
    const data = await response.json();
    return data;
  };