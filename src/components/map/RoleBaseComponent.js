import Tracking from "../../map-items/real-time/vehicle-tracking/Tracking";
import Customer from "../../map-items/layers/Customer";
import InactiveCPE from "../../map-items/layers/InactiveCPE";
import DC from "../../map-items/layers/DC";
import FAT from "../../map-items/layers/FAT";
import Joint from "../../map-items/layers/Joint";
import Feeder from "../../map-items/layers/Feeder";
import Distribution from "../../map-items/layers/Distribution";
import Backhaul from "../../map-items/layers/Backhaul";
import POP from "../../map-items/layers/POP";
import Zone from "../../map-items/layers/Zone";
import HomeWidget from "../../widgets/mini-widgets/HomeWidget";
import CoordinateWidget from "../../widgets/mini-widgets/CoordinateWidget";
import Editor from "../../widgets/editor/Editor";
import Legend from "../../widgets/legend/Legend";
import Outage from "../../map-items/layers/Outage";
import GISEditor from "../../widgets/editor/GISEditor";
import SearchWidget from "../../widgets/search/SearchWidget";
import Gpondb from "../../map-items/table/Gpondb";
import SelectGraphic from "../../widgets/selectionTool/SelectGraphic";

const componentsRole = [
  {
    component: Tracking,
    key: 'Tracking',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin"],
    permission:"Select"
  },
  {
    component: Customer,
    key: 'Customer',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
    permission:"Select"
  },
  {
    component: InactiveCPE,
    key: 'InactiveCPE',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
    permission:"Select"
  },
  {
    component: DC,
    key: 'DC',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
    permission:"Select"
  },
  {
    component: FAT,
    key: 'FAT',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
    permission:"Select"
  },
  {
    component: Joint,
    key: 'Joint',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
    permission:"Select"
  },
  {
    component: Feeder,
    key: 'Feeder',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
    permission:"Select"
  },
  {
    component: Distribution,
    key: 'Distribution',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
  },
  {
    component: Backhaul,
    key: 'Backhaul',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin"],
  },
  {
    component: POP,
    key: 'POP',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
  },
  {
    component: Zone,
    key: 'Zone',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
  },
  {
    component: HomeWidget,
    key: 'HomeWidget',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
  },
  {
    component: CoordinateWidget,
    key: 'CoordinateWidget',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
  },
  {
    component: Legend,
    key: 'Legend',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
  },
  {
    component: Outage,
    key: 'Outage',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin"],
  }, 
  {
    component: SearchWidget,
    key: 'SearchWidget',
    roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
  },
];

const componentsPermission = [
  {
    component: Editor,
    key: 'Editor',
    permission: "Edit",
  },
  {
    component: GISEditor,
    key: 'GISEditor',
    permission: "GIS",
  },
];

const otherComponents = [
    {
        component: Gpondb,
        key: 'Gpondb',
        roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin", "CSD"],
      },
      {
        component: SelectGraphic,
        key: 'SelectGraphic',
        roles: ["SouthDEVuser", "CentralDEVuser", "NorthDEVuser", "Admin"],
      },
]
export { componentsRole,componentsPermission, otherComponents };
