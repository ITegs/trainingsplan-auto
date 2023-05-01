<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  import { generatePDF } from "./utils/generatePDF";
  import type { section, newSection } from "./utils/types";
  import { Template } from "./utils/types";

  import Header from "./lib/Header.svelte";

  let name = "";
  let title = "";
  let newSec: newSection = {
    name: "",
    text: "",
  };
  let files: FileList;
  let sections: section[] = [];

  let finished = true;

  let template: Template;

  onMount(async () => {
    template = localStorage.getItem("template") as Template;
    if (template === null) {
      template = Template.blank;
      localStorage.setItem("template", template);
    }
  });

  function addSection() {
    let temp = newSec;
    temp.images = files;
    sections = [...sections, temp as section];
    newSec = {
      name: "",
      text: "",
    };
  }

  function deleteSection(i: number) {
    sections.splice(i, 1);
    sections = [...sections];
  }

  function generate() {
    finished = false;
    generatePDF(name, title, sections, template).then(() => {
      finished = true;
    });
  }
</script>

<main>
  <Header />

  <input class="text" type="text" placeholder="Name" bind:value={name} />
  <input
    class="text"
    type="text"
    placeholder="Titel des Plans"
    bind:value={title}
  />

  <div class="sections">
    {#if sections.length > 0}
      {#each sections as section, i}
        <hr in:slide out:slide />
        <div class="sectionTitle" in:slide out:slide>
          <p>Abschnitt {i}</p>
          &mdash;
          <h1>{section.name}</h1>
        </div>
        <p>{section.text}</p>
        {#if section.images}
          <div class="images" in:slide out:slide>
            {#each section.images as image, i}
              <img
                class="img"
                src={URL.createObjectURL(image)}
                alt={"Image " + i}
              />
            {/each}
          </div>
        {/if}
        <img
          src="src/assets/Close.svg"
          alt="Delete item"
          width="30"
          on:click={() => deleteSection(i)}
          on:keypress={null}
          class="close"
        />
      {/each}
      <hr in:slide out:slide />
    {:else}
      <p>Noch keine Abschnitte vorhanden</p>
    {/if}
  </div>

  <div class="add-section">
    <h1>Neuer Abschnitt</h1>
    <input
      class="as-title"
      type="text"
      placeholder="Titel des Abschnitts"
      bind:value={newSec.name}
    />
    <textarea
      class="as-text"
      placeholder="Beschreibung"
      bind:value={newSec.text}
    />
    <input type="file" accept="image/*" multiple bind:files />
    {#if files}
      <div class="images">
        {#each files as file, i}
          <img class="img" src={URL.createObjectURL(file)} alt={"Image " + i} />
        {/each}
      </div>
    {/if}
    <button class="as-button" on:click={addSection}>Abschnitt hinzufügen</button
    >
  </div>

  {#if !finished}
    <p class="loading" out:slide>PDF wird erstellt...</p>
  {/if}

  <button
    class="generate"
    in:slide
    out:slide
    on:click={generate}
    disabled={!finished}>PDF erstellen</button
  >

  <div class="template">
    <p>Template</p>
    <select
      class="select"
      bind:value={template}
      on:change={() => localStorage.setItem("template", template)}
    >
      <option value={Template.blank}>Default</option>
      <option value={Template.janina}>Janina</option>
      <option value={Template.flo}>Flo</option>
    </select>
  </div>
</main>

<style>
  .text {
    font-size: 1rem;
    font-weight: bold;
    margin: 0.5em;
  }
  .sections {
    margin-block: 5em;
  }

  .sectionTitle {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding-inline: 2rem;
  }

  .images {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    padding-inline: 2rem;
  }

  .img {
    width: 10rem;
    padding: 0.1em;
  }

  @media (max-width: 480px) {
    .img {
      width: auto;
      height: 8em;
    }
    .add-section {
      margin-inline: 1em;
    }

    .loading {
      margin-inline: 1em;
    }
  }

  .close {
    cursor: pointer;
    padding: 0.5em;
  }

  .add-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    border-radius: 5px;
  }

  .as-title {
    font-size: 1rem;
    font-weight: bold;
  }

  .as-text {
    font-size: 1rem;
    margin: 1rem;
    width: 80%;
    height: 10rem;
  }

  .as-button {
    font-size: 1rem;
    font-weight: bold;
    margin: 2em;
    border: 1px solid black;
    border-radius: 5px;
    color: var(--color-primary);
    padding: 1em;
  }

  .generate {
    font-size: 1rem;
    font-weight: bold;
    margin: 1em;
    border: 1px solid black;
    border-radius: 5px;
    color: var(--color-primary);
    padding: 1em;
  }

  .loading {
    font-size: 1rem;
    font-weight: bold;
    border: 1px solid red;
    border-radius: 5px;
    color: red;
    padding: 1em;
    animation: blink-fade 1.5s infinite;
  }

  @keyframes blink-fade {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .template {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding-inline: 2rem;
    border: 1px solid;
    border-radius: 5px;
    margin: 1em;
  }

  .select {
    appearance: none;
    border: none;
    background-color: transparent;
    font-weight: bold;
    font-size: 1rem;
    color: var(--color-theme);
  }
</style>
