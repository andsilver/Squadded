<template>
	<v-layout
		column
		justify-center
		align-center
	>
		<v-flex
			xs12
			sm8
			md6
		>
			<div class="text-xs-center">
				<v-card>
					<v-card-actions>
						<v-btn
							color="primary"
							flat
							nuxt
							to="/inspire"
						>
							Continue
						</v-btn>
					</v-card-actions>
				</v-card>
			</div>
		</v-flex>
	</v-layout>
</template>

<script>
export default {
}
</script>
