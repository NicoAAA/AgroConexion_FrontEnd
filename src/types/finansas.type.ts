interface StatsResponse {
  total_spent: number;
  total_earned: number;
  most_sold_product: {
    name: string;
    quantity: number;
  };
  least_sold_product: {
    name: string;
    quantity: number;
  };
}