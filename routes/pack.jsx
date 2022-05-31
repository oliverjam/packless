/**
 * @typedef {Object} PackItem
 * @property {string} item
 * @property {number} weight
 * @property {number} quantity
 */
/**
 * @type {Map<string, PackItem>}
 */
let pack = new Map();

export function get(request, params) {
  let total = Array.from(pack.values()).reduce(
    (total, { weight, quantity }) => total + weight * quantity,
    0
  );
  return (
    <main>
      <h1>Your pack {params.id}</h1>
      <div class="Pack">
        <div class="Sticky Row">
          {total ? <div class="Total">{total}g</div> : null}
          <Form action="new" />
        </div>
        {Array.from(pack.values()).map((row) => (
          <div class="Row">
            <Form action="update" {...row} />
          </div>
        ))}
      </div>
    </main>
  );
}

function Form({ action, item, weight, quantity = 1 }) {
  return (
    <form method="POST" class="Form" data-action={action}>
      <input type="hidden" name="_action" value={action} />
      <input
        name="item"
        value={item}
        required
        placeholder="Item"
        aria-label="Item"
        class="input item"
        autofocus={action === "new"}
      />
      <span class="input">
        <input
          name="weight"
          type="number"
          value={weight}
          required
          class="weight"
          placeholder="Weight"
          aria-label="Weight"
        />
        <span>g</span>
      </span>
      <span class="input">
        <span>&times;</span>
        <input
          name="quantity"
          type="number"
          value={quantity}
          required
          class="qty"
          aria-label="Quantity"
        />
      </span>
      <button
        aria-label={action === "update" ? "Update" : "Save"}
        type="submit"
        hidden
      >
        {action === "update" ? <PencilIcon /> : <PlusIcon />}
      </button>
    </form>
  );
}

export async function post(request, params) {
  let body = await request.formData();
  switch (body.get("_action")) {
    case "new":
    case "update":
      pack.set(body.get("item"), Object.fromEntries(body));
      break;
  }
  return Response.redirect(request.url);
}

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path
        fill-rule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
