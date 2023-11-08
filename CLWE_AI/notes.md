---
title: "Using more LaTeX packages"
output: 
	html_document:
		latex_engine: xelatex
    includes:
      in_header:
        - preamble.sty
---
$$
\Var
$$


## Notes on CLWE, Quantization, and the Random Fourier Feature Models

### Homogeneous CLWE and Its Quantization
CLWE (continuous learning with errors) is the continuous equivalent of learning with errors. At a *high* level we have two equivalent hardness assumptions (decision and search version):
$$
z_i \approx \gamma {a_i, s} + e_i \mod q
\Var
$$
