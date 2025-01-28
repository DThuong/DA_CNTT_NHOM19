import path from "./path";
import icons from "./icons";
export const navigation = [
  {
    id: 1,
    value: "HOME",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "PRODUCTS",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: "BLOGS",
    path: `/${path.BLOGS}`,
  },
];

export const productInfor = [
  {
    id: 1,
    name: "DISCRIPTION",
    content: `Technology: GSM / HSPA / LTE
Dimensions: 153.8 x 75.5 x 7.6 mm
Weight: 154 g
Display: IPS LCD 5.5 inches
Resolution: 720 x 1280
OS: Android OS, v6.0 (Marshmallow)
Chipset: Octa-core
CPU: Octa-core
Internal: 32 GB, 4 GB RAM
Camera: 13MB - 20 MP`,
  },
  {
    id: 2,
    name: "WARRANTY",
    content: `Warranty Information
LIMITED WARRANTIES
Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:

Frames Used In Upholstered and Leather Products
Limited Lifetime Warranty
A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
  },
  {
    id: 3,
    name: "DELIVERY",
    content: `Purchasing & Delivery
Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
  },
  {
    id: 4,
    name: "PAYMENT",
    content: `Purchasing & Delivery
Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
  },
  {
    id: 5,
    name: "CUSTOMER PREVIEWS",
    content: `Customer Reviews
Based on 3 reviews
Write a review`,
  },
];

export const colors = [
  { name: "Gray" },
  { name: "Silver" },
  { name: "White" },
  { name: "Gold" },
  { name: "Black" },
  { name: "Red" },
];

export const sorts = [
  {
    id: 1,
    value: "-sold",
    text: "best selling",
  },
  {
    id: 2,
    value: "-price",
    text: "Highest price to Lowest price",
  },
  {
    id: 3,
    value: "price",
    text: "Lowest price to Highest price",
  },
];

const {
  MdDashboard,
  FaUsers,
  GoListUnordered,
  FaProductHunt,
  FaUser,
  TbJewishStarFilled,
  FaHistory,
  FaShoppingCart,
} = icons;
export const adminSidebar = [
  {
    id: 1,
    type: "single",
    text: "Dashboard",
    icon: <MdDashboard />,
    path: `${path.DASHBOARD}`,
  },
  {
    id: 2,
    type: "single",
    text: "Manage users",
    icon: <FaUsers />,
    path: `${path.MANAGE_USER}`,
  },
  {
    id: 3,
    type: "parent",
    text: "Manage products",
    icon: <FaProductHunt />,
    submenu: [
      {
        text: "Create product",
        path: `${path.CREATE_PRODUCT}`,
      },
      {
        text: "Manage products",
        path: `${path.MANAGE_PRODUCT}`,
      },
    ],
  },
  {
    id: 4,
    type: "single",
    text: "Manage orders",
    icon: <GoListUnordered />,
    path: `${path.MANAGE_ORDER}`,
  },
];

export const memberSidebar = [
  {
    id: 1,
    type: "single",
    text: "Personal",
    icon: <FaUser />,
    path: `${path.PERSONAL}`,
  },
  {
    id: 2,
    type: "single",
    text: "My cart",
    icon: <FaShoppingCart />,
    path: `${path.MY_CART}`,
  },
  {
    id: 3,
    type: "single",
    text: "Buy history",
    icon: <FaHistory />,
    path: `${path.HISTORY}`,
  },
  {
    id: 4,
    type: "single",
    text: "Wish list",
    icon: <TbJewishStarFilled />,
    path: `${path.WISH_LIST}`,
  },
];

export const roles = [
  {
    code: 2024,
    value: "User",
  },
  {
    code: 2002,
    value: "Admin",
  },
];
