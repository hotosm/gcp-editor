import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('load-btn')
export class LoadBtn extends LitElement {
  static styles = css`
    button {
      padding: 10px 14px;
      background-color: #f73f3f;
      color: #ffffff;
      border: none;
      font-size: 18px;
      border-radius: 8px;
    }
    button:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  `;

  // Dispatch a custom event when the button is clicked
  private handleButtonClick() {
    const event = new CustomEvent('load-COG', {
      detail: { message: 'COG load' },
      bubbles: true, // Allow the event to bubble up
      composed: true, // Allow the event to cross shadow DOM boundaries
    });
    this.dispatchEvent(event); // Dispatch the event to parent or ancestor
  }

  render() {
    return html`
      <div>
        <button @click="${this.handleButtonClick}">Load COG Image</button>
      </div>
    `;
  }
}
