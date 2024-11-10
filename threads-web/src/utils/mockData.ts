// src/utils/mockData.ts
export const mockFetchMoreItems = async (page: number): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItems = Array.from({ length: 10 }, (_, i) => ({
        id: page * 10 + i + 1,
        title: `Item ${page * 10 + i + 1}`
      }))
      resolve(newItems)
    }, 1000) // Simulates a 1-second delay
  })
}
