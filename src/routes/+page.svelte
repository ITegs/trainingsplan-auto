<script lang="ts">
	type section = {
		name: string;
		text: string;
		images: FileList;
	};

	let name = '';
	let newSection: any = {
		name: '',
		text: ''
	};
	let files: FileList;
	let sections: section[] = [];

	function addSection() {
		let temp = newSection;
		temp.images = files;
		sections = [...sections, temp];
		newSection = {
			name: '',
			text: ''
		};
	}
</script>

<h1>Trainingsplan erstellen</h1>
<input class="name" type="text" placeholder="Name des Trainingsplans" bind:value={name} />

<div class="sections">
	{#if sections.length > 0}
		{#each sections as section, i}
			<hr />
			<div class="sectionTitle">
				<p>Abschnitt {i}</p>
				&mdash;
				<h1>{section.name}</h1>
			</div>
			<p>{section.text}</p>
			{#if section.images}
				<div class="images">
					{#each section.images as image, i}
						<img class="img" src={URL.createObjectURL(image)} alt="i" />
					{/each}
				</div>
			{/if}
		{/each}
		<hr />
	{/if}
</div>

<div class="add-section">
	<h1>Neuer Abschnitt</h1>
	<input
		class="as-title"
		type="text"
		placeholder="Name des Abschnitts"
		bind:value={newSection.name}
	/>
	<textarea class="as-text" placeholder="Text" bind:value={newSection.text} />
	<input type="file" accept="image/*" multiple bind:files />
	{#if files}
		<div class="images">
			{#each files as file, i}
				<img class="img" src={URL.createObjectURL(file)} alt="i" />
			{/each}
		</div>
	{/if}
	<button class="as-button" on:click={addSection}>Abschnitt hinzufügen</button>
</div>

<style>
	.name {
		font-size: 1rem;
		font-weight: bold;
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
		font-weight: bold;
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
</style>
