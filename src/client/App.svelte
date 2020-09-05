<script lang="typescript">
  import routes from "../../../../src/routes";

  const route = Object.keys(routes)
    .map((m) => {
      const params = m.match(/:[^\s/]+/g);
      let routeMatcher = new RegExp(
        "^" + m.replace(/:[^\s/]+/g, "([\\w-]+)") + "$"
      );
      const match = window.location.pathname.match(routeMatcher);
      if (match) {
        let filledParams = {};
        if (params) {
          for (let i = 0; i < params.length; i++) {
            filledParams[params[i].substr(1)] = match[i + 1];
          }
        }

        return {
          Component: routes[m],
          Params: filledParams,
        };
      } else {
        return null;
      }
    })
    .filter((m) => m);

  const Component = route.length ? route[0].Component : null;
  const ComponentParams = route.length ? route[0].Params : null;
</script>

{#if Component}
  <Component {...ComponentParams} />
{:else}Cannot Find Path{/if}
