export const removeDuplicates = (data: { id: string; parentId: string | null }[]) =>
  data.reduce((acc: { id: string; parentId: string | null }[], current) => {
    if (!acc.find((item) => item.id === current.id)) {
      acc.push(current);
    }
    return acc;
  }, []);
