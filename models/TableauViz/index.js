export { useFilters } from './controller';

// Session designed to securely authorize users server-side PRIVATE routes
export class TableauViz {
  constructor(props) {
    this.options = props.options;
    this.vizObj = null;
    this.activeSheet = null;
  }
}
