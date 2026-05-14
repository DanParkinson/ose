import { Grid, GridItem } from "@chakra-ui/react";

import PaginationButton from "../buttons/PaginationButton";
import PaginationLabel from "./PaginationLabel";

const Pagination = ({
  previous,
  next,
  offset,
  limit,
  count,
  onPrevious,
  onNext,
}) => {
  return (
    <Grid
      templateColumns={{
        base: "1fr 1fr",
        lg: "1fr 1fr 1fr",
      }}
      templateAreas={{
        base: `
          "a a"
          "b c"
        `,
        lg: `
          "a a a"
          "b . c"
        `,
      }}
      gap={4}
      alignItems="center"
      w="100%"
    >
      <GridItem area="a">
        <PaginationLabel
          offset={offset}
          limit={limit}
          count={count}
        />
      </GridItem>

      <GridItem area="b">
        <PaginationButton
          disabled={!previous || offset === 0}
          onClick={onPrevious}
        >
          Previous
        </PaginationButton>
      </GridItem>

      <GridItem area="c" justifySelf="end">
        <PaginationButton
          disabled={!next}
          onClick={onNext}
        >
          Next
        </PaginationButton>
      </GridItem>
    </Grid>
  );
};

export default Pagination;
