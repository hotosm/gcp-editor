import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from '../store';

@customElement('cog-url-input')
export class CogUrlInput extends LitElement {
  @property({ type: Object }) input: string = '';

  static styles = css`
    :host {
      padding: 14px;
    }
    #input-wrapper {
      width: 100%;
      display: flex;
      gap: 4px;
    }
    #cog-url-input {
      height: 36px;
      border: solid 1px black;
      border-radius: 8px;
      padding-left: 10px;
      font-size: 18px;
      width: 100%;
    }
  `;

  private handleInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.input = inputElement.value?.trim();
    Store.setCogUrl(this.input);
  }
  render() {
    return html`
      <div id="input-wrapper">
        <input
          type="text"
          name="cog-url"
          id="cog-url-input"
          placeholder="Enter COG url"
          .value=${this.input}
          @input=${this.handleInputChange}
        />
      </div>
    `;
  }
}
