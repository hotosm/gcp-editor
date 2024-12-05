import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from '../store';

@customElement('projection-input')
export class ProjectionInput extends LitElement {
  @property({ type: Object }) input: string = '3857';

  static styles = css`
    :host {
      padding: 14px;
    }
    #input-wrapper {
      display: flex;
      width: 100%;
    }
    #projection-input {
      height: 32px;
      border: solid 1px black;
      border-radius: 8px;
      font-size: 18px;
      padding: 4px 8px;
    }
  `;

  private handleInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.input = inputElement.value?.trim();
    Store.setProjection(this.input);
  }

  render() {
    return html`
      <div id="input-wrapper">
        <input
          type="text"
          name="projection"
          id="projection-input"
          placeholder="Enter Projection"
          .value=${this.input}
          @input=${this.handleInputChange}
        />
      </div>
    `;
  }
}
