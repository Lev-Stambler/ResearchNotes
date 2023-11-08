# Something with Quantum Circuits and Expectation of Post-Processing AC0

## Using Polynomial Factorization and Chinese Remainder Theorem
We can get non-trivial upper and lower bounds on the expectation of post-processing $\ACZ$ circuits by heavily relying on the two following papers
- [On Polynomial Approximations to $\ACZ$](https://arxiv.org/pdf/1604.08121.pdf)
	This paper will allow us to bound the output of the probabilistic polynomial to something **very** nice. Specifically,
	we get that for any $\mathbf{x} \in \binSet^n$ and $\ACZ$ circuit of size $s$ and degree $d$, $|f(\mathbf{x})| \leq (\log s)^{O(d)} \log(1 / \eps)$! Because we can square $f$ without experiencing too much pain, we will assume that

\begin{equation}
0 \leq f(x) \leq (\log s)^{O(d)} \log(1 / \eps).
\end{equation}

- [Fast polynomial factorization and modular composition](http://users.cms.caltech.edu/~umans/papers/KU08-final.pdf)
	This is quite a fascinating paper IMO and something that cryptographers are hoping to use (though the parameters there do not quite work out). The key part that we will focus on is **Section 4** (Fast multivariate multipoint evaluation (in any characteristic). Specifically, we only care about the MULTIMODULAR algorithm (on the bottom of page 12 in the box)

## Appendix-ish
### Chat GPT on Linearity of Expectation and Finite Fields
The concept of linearity of expectation is a fundamental principle in probability theory that holds true regardless of whether or not the random variables are independent. The principle states that for any two random variables \( X \) and \( Y \), the expectation of their sum is equal to the sum of their expectations:

$$ \mathbb{E}[X + Y] = \mathbb{E}[X] + \mathbb{E}[Y] $$

This principle can be extended to any finite number of random variables. For instance, if \( X_1, X_2, ..., X_n \) are random variables (not necessarily independent), then:

$$ \mathbb{E}\left[\sum_{i=1}^{n} X_i\right] = \sum_{i=1}^{n} \mathbb{E}[X_i] $$

When you mention "for a field modulo 1," it seems like you might be talking about values being taken modulo 1, which essentially means you're looking at the fractional part of a number (since taking a number modulo 1 gives you the fractional component of that number). In a probabilistic context, if you're dealing with random variables \( X_i \) where you consider \( X_i \mod 1 \), then you're interested in the expectation of the fractional parts of these variables.

Even in such a scenario, linearity of expectation still holds. If \( X \) and \( Y \) are random variables, then the expectation of their sum modulo 1 is:

$$ \mathbb{E}[(X + Y) \mod 1] = \mathbb{E}[X \mod 1 + Y \mod 1 - \mathbb{I}\{X \mod 1 + Y \mod 1 \geq 1\}] $$

where \( \mathbb{I} \) is the indicator function which is 1 if \( X \mod 1 + Y \mod 1 \geq 1 \) and 0 otherwise. This equation accounts for the "wrap around" effect of the modulo operation.

However, the linearity of expectation principle directly would mean:

$$ \mathbb{E}[(X + Y) \mod 1] = \mathbb{E}[X \mod 1] + \mathbb{E}[Y \mod 1] - \mathbb{E}[\mathbb{I}\{X \mod 1 + Y \mod 1 \geq 1\}] $$

In the above equation, the expectations on the right-hand side might not necessarily be straightforward to calculate due to the indicator function. However, the linearity itself does not guarantee that the expected value of the modulo operation is the modulo of the expected values; these are not equivalent because the modulo operation is not a linear transformation.

Therefore, while linearity of expectation holds in general, applying it within the context of modular arithmetic requires careful consideration of the wraparound effect that the modulo operation introduces. When you calculate expectations modulo 1, you must consider the fact that the operation may transform the distribution of your random variables in a nonlinear way, especially around the wraparound point.