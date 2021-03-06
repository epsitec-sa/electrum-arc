/* global window */

import {React} from 'electrum';

import {
  Container,
  Label,
  Table
} from '../../all-components.js';

export default class DispatchTable2 extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    let data = this.read ('data');
    if (data) {
      data = JSON.parse (data);
    } else {
      data = window.document.dataTable2;
    }

    return (
      <Container kind='view-right' width='1000px' {...this.link ()} >
        <Container kind='column-full' {...this.link ()} >
          <Container kind='pane-header' {...this.link ()} >
            <Label text='Mission' kind='pane-header' {...this.link ()} />
          </Container>
          <Container kind='panes' {...this.link ()} >
            <Container kind='pane' anchor='sender-doc' {...this.link ()} >
              <Container kind='row-pane' {...this.link ()} >
                <Label text='Document' grow='1' kind='title' {...this.link ()} />
              </Container>
              <Container kind='row-pane' {...this.link ()} >
                <Table data={data} {...this.link ()} />
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    );
  }
}
