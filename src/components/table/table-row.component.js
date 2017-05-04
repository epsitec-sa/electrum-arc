import {React} from 'electrum';

/******************************************************************************/
export default class TableRow extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      hover: false,
    };
  }

  get hover () {
    return this.state.hover;
  }

  set hover (value) {
    this.setState ( {
      hover: value
    });
  }

  /******************************************************************************/

  onMyMouseOver () {
    this.hover = true;
  }

  onMyMouseOut () {
    this.hover = false;
  }

  onMyMouseDown () {
    const x = this.read ('selectionChanged');
    if (x) {
      const row = this.read ('row');
      x (row.id);
    }
  }

  /******************************************************************************/

  renderRowColumn (description, column, last, index) {
    const style = this.mergeStyles ('cell');

    if (column.Width) {
      style.minWidth = column.Width;
      style.maxWidth = column.Width;
    } else if (column.Grow) {
      style.flexGrow   = column.Grow;
      style.flexShrink = '0';
      style.flexBasis  = '0%';
      style.minWidth   = '0px';
      style.overflow   = 'hidden';
    }
    style.textAlign = column.TextAlign;

    if (!last) {
      style.marginRight = this.props.theme.shapes.tablePadding;
    }

    return (
      <div
        key         = {index}
        style       = {style}
        onMouseOver = {this.onMyMouseOver}
        onMouseOut  = {this.onMyMouseOut}
        onMouseDown = {this.onMyMouseDown}
        >
        {description}
      </div>
    );
  }

  renderRowColumns (header, row) {
    const result = [];
    let index = 0;
    for (var column of header) {
      const description = row[column.Name];
      const last = index === header.length - 1;
      result.push (this.renderRowColumn (description, column, last, index++));
    }
    return result;
  }

  render () {
    const header   = this.read ('header');
    const row      = this.read ('row');
    const index    = this.read ('index');
    const selected = this.read ('selected');

    var styleName = (selected === 'true') ? 'rowSelected' : (this.hover ? 'rowHover' : 'row');
    const rowStyle = this.mergeStyles (styleName);

    return (
      <div key={index} style={rowStyle}>
        {this.renderRowColumns (header, row)}
      </div>
    );
  }
}

/******************************************************************************/
