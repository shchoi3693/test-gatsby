import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { PostListItemType } from 'types/PostItem.types'

export type useInfiniteScrollType = {
  containerRef: MutableRefObject<HTMLDivElement | null>
  postList: PostListItemType[]
}

const NUMBER_OF_ITEMS_PER_PAGE = 4

const useInfiniteScroll = (
  selectedCategory: string,
  posts: PostListItemType[],
): useInfiniteScrollType => {
  // const containerRef = useRef(null);
  const containerRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null)
  const observer: MutableRefObject<IntersectionObserver | null> =
    useRef<IntersectionObserver>(null)
  const [count, setCount] = useState<number>(1)

  const postData = useMemo<PostListItemType[]>(
    () =>
      posts.filter(
        ({
          node: {
            frontmatter: { categories },
          },
        }: PostListItemType) =>
          selectedCategory === 'All'
            ? true
            : categories.includes(selectedCategory),
      ),
    [selectedCategory],
  )

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries, observer) => {
        if (!entries[0].isIntersecting) return
        setCount(val => val + 1)
        //observer.disconnect()
        observer.unobserve(entries[0].target)
      },
      { threshold: 1 },
    )
  }, [])

  useEffect(() => setCount(1), [selectedCategory])
  useEffect(() => {
    if (
      NUMBER_OF_ITEMS_PER_PAGE * count >= postData.length ||
      containerRef.current === null ||
      containerRef.current.children.length === 0 ||
      observer.current === null
    )
      return
    observer.current.observe(
      containerRef.current.children[containerRef.current.children.length - 1],
    )
  }, [count, selectedCategory])

  return {
    containerRef,
    postList: postData.slice(0, count * NUMBER_OF_ITEMS_PER_PAGE),
  }
}

export default useInfiniteScroll
